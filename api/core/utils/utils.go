package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"time"
)

var secretKey = []byte(os.Getenv("SECRET_KEY"))

func BodyDecoder(r *http.Request, dest interface{}) error {
	contentType := r.Header.Get("Content-Type")
	log.Printf("Content-Type: %s\n", contentType)
	if strings.Contains(contentType, "application/json") {
		return json.NewDecoder(r.Body).Decode(dest)
	} else if strings.Contains(contentType, "multipart/form-data") {
		err := r.ParseMultipartForm(32 << 20)
		if err != nil {
			return err
		}

		// Get the destination as a map to set fields dynamically
		destMap, ok := dest.(map[string]interface{})
		if ok {
			// Copy form values to the destination map
			for k, v := range r.MultipartForm.Value {
				if len(v) > 0 {
					destMap[k] = v[0]
				}
			}

			// Handle files if present
			// Check for common file fields: thumbnail, avatar, attachments
			for _, fileField := range []string{"thumbnail", "avatar", "attachments"} {
				file, fileHeader, err := r.FormFile(fileField)
				if err == nil {
					// Read file data
					fileData := make([]byte, fileHeader.Size)
					_, err = file.Read(fileData)
					if err != nil {
						err := file.Close()
						if err != nil {
							return err
						}
						return err
					}
					destMap[fileField] = fileData

					// Extract file extension from original filename
					filename := fileHeader.Filename
					ext := filepath.Ext(filename)
					destMap[fileField+"Ext"] = ext

					err := file.Close()
					if err != nil {
						return err
					}
				}
			}
		} else {
			// Try to use reflection to set struct fields
			v := reflect.ValueOf(dest)
			if v.Kind() != reflect.Ptr || v.Elem().Kind() != reflect.Struct {
				return fmt.Errorf("destination must be a pointer to a struct or a map")
			}

			v = v.Elem()
			t := v.Type()

			// Copy form values to struct fields
			for k, values := range r.MultipartForm.Value {
				if len(values) == 0 {
					continue
				}

				// Find field by JSON tag or field name
				var field reflect.Value
				for i := 0; i < t.NumField(); i++ {
					fieldType := t.Field(i)
					tag := fieldType.Tag.Get("json")
					if tag == k || fieldType.Name == k {
						field = v.Field(i)
						break
					}
				}

				if !field.IsValid() || !field.CanSet() {
					continue
				}

				// Set field value based on its type
				switch field.Kind() {
				case reflect.String:
					field.SetString(values[0])
				case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
					intVal, err := strconv.ParseInt(values[0], 10, 64)
					if err == nil {
						field.SetInt(intVal)
					}
				case reflect.Float32, reflect.Float64:
					floatVal, err := strconv.ParseFloat(values[0], 64)
					if err == nil {
						field.SetFloat(floatVal)
					}
				case reflect.Bool:
					boolVal, err := strconv.ParseBool(values[0])
					if err == nil {
						field.SetBool(boolVal)
					}
				default:
					panic("unhandled default case")
				}
			}

			// Handle files if present
			// Check for common file fields: thumbnail, avatar, attachments
			for _, fileField := range []string{"thumbnail", "avatar", "attachments"} {
				file, fileHeader, err := r.FormFile(fileField)
				if err == nil {
					// Find corresponding field in struct
					var field reflect.Value
					// Capitalize first letter of fileField (e.g., "thumbnail" -> "Thumbnail")
					fieldName := ""
					if len(fileField) > 0 {
						fieldName = strings.ToUpper(fileField[:1]) + fileField[1:]
					}

					for i := 0; i < t.NumField(); i++ {
						fieldType := t.Field(i)
						tag := fieldType.Tag.Get("json")
						// Check if tag matches fileField or if field name matches capitalized fileField
						if strings.Split(tag, ",")[0] == fileField || fieldType.Name == fieldName {
							field = v.Field(i)
							break
						}
					}

					if field.IsValid() && field.CanSet() {
						// Read file data
						fileData := make([]byte, fileHeader.Size)
						_, err = file.Read(fileData)
						if err != nil {
							err := file.Close()
							if err != nil {
								return err
							}
							return err
						}

						// Set field based on its type
						if field.Kind() == reflect.Slice && field.Type().Elem().Kind() == reflect.Uint8 {
							// For []byte fields
							field.SetBytes(fileData)
						} else if field.Kind() == reflect.String {
							// For string fields, store as base64
							field.SetString(string(fileData))
						} else if field.Type().String() == "sql.NullString" {
							// For sql.NullString fields
							nullString := reflect.New(field.Type()).Elem()
							stringVal := reflect.ValueOf(string(fileData))
							nullString.Field(0).Set(stringVal) // Set String field
							nullString.Field(1).SetBool(true)  // Set Valid field to true
							field.Set(nullString)
						}

						// Extract file extension from original filename
						filename := fileHeader.Filename
						ext := filepath.Ext(filename)

						// Find corresponding extension field in struct
						var extField reflect.Value
						extFieldName := fieldName + "Ext"

						for i := 0; i < t.NumField(); i++ {
							fieldType := t.Field(i)
							tag := fieldType.Tag.Get("json")
							// Check if tag matches fileField+"Ext" or if field name matches capitalized fileField+"Ext"
							if strings.Split(tag, ",")[0] == fileField+"Ext" || fieldType.Name == extFieldName {
								extField = v.Field(i)
								break
							}
						}

						if extField.IsValid() && extField.CanSet() && extField.Kind() == reflect.String {
							extField.SetString(ext)
						}
					}
					err := file.Close()
					if err != nil {
						return err
					}
				}
			}
		}

		return nil

	} else {
		return fmt.Errorf("unsupported content type: %s", contentType)
	}
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}

func GetTokenFromCookie(r *http.Request) (*jwt.Token, error) {
	tokenString, err := r.Cookie("token")
	if err != nil && errors.Is(err, http.ErrNoCookie) {
		return nil, http.ErrNoCookie
	}

	token, err := VerifyToken(tokenString.Value)
	if err != nil {
		fmt.Printf("Token verification failed: %v\\n", err)
		return nil, err
	}

	return token, nil
}

func SaveFileToDisk(fileData []byte, uploadDir string, namePrefix string, fileExt string) (string, error) {
	beginPath := "./uploads/"

	fullPath := filepath.Join(beginPath, uploadDir)

	err := os.MkdirAll(fullPath, 0755)
	if err != nil {
		return "", fmt.Errorf("error creating directory: %w", err)
	}

	if fileExt == "" {
		return "", fmt.Errorf("file extension is required")
	}

	fileName := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), namePrefix, fileExt)
	fileName = filepath.Clean(filepath.Base(fileName))
	filePath := filepath.Join(fullPath, fileName)

	err = os.WriteFile(filePath, fileData, 0644)
	if err != nil {
		return "", fmt.Errorf("error writing file: %w", err)
	}

	return filePath, nil
}
