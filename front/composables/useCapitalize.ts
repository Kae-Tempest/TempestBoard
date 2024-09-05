export function useCapitalize(s: string) {

    if (s.includes('_')) {
        let w = s.split('_')
        let cp: string[] = []
        w.forEach(word => {
            cp.push(word.charAt(0).toUpperCase() + word.slice(1))
        })
        return cp[0] + ' ' +cp[1]
    } else return s.charAt(0).toUpperCase() + s.slice(1)
}