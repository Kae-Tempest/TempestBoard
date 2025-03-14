package fr.tempest.tempestboard.config;

import fr.tempest.tempestboard.permission.Permission;
import fr.tempest.tempestboard.role.Role;
import fr.tempest.tempestboard.role.RoleRepository;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Aspect
@Component
public class SecurityAnnotationProcessor {
    private final RoleRepository roleRepository;

    public SecurityAnnotationProcessor(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Around("@annotation(fr.tempest.tempestboard.config.RequiresPermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        RequiresPermission annotation = method.getAnnotation(RequiresPermission.class);
        String[] requiredPermissions = annotation.value();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AccessDeniedException("Not authenticated");
        }

        // Extract role names from authorities
        Set<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5)) // Remove "ROLE_" prefix
                .collect(Collectors.toSet());

        // Get roles from database
        List<Role> roles = roleRepository.findByNameIn(userRoles);

        // Extract all permissions from user's roles
        boolean hasPermission = roles.stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(Permission::getName)
                .anyMatch(permission -> Arrays.asList(requiredPermissions).contains(permission));

        if (!hasPermission) {
            throw new AccessDeniedException("Access denied: missing required permission");
        }

        return joinPoint.proceed();
    }

    @Around("@annotation(fr.tempest.tempestboard.config.RequiresRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        RequiresRole annotation = method.getAnnotation(RequiresRole.class);
        String[] requiredRoles = annotation.value();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AccessDeniedException("Not authenticated");
        }

        // Extract role names from authorities
        Set<String> userRoles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5)) // Remove "ROLE_" prefix
                .collect(Collectors.toSet());

        // Fetch roles from DB to validate they exist and are active
        List<Role> validRoles = roleRepository.findByNameIn(userRoles);
        Set<String> validRoleNames = validRoles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        boolean hasRole = Arrays.stream(requiredRoles)
                .anyMatch(validRoleNames::contains);

        if (!hasRole) {
            throw new AccessDeniedException("Access denied: missing required role");
        }

        return joinPoint.proceed();
    }
}