// Create a composable for managing active dropdown state
 export function useDropdownState() {
    const activeDropdownId = useState<number | null>('activeDropdownId', () => null)

    const openDropdown = (id: number) => {
        activeDropdownId.value = id
    }

    const closeDropdown = () => {
        activeDropdownId.value = null
    }

    const toggleDropdown = (id: number) => {
        if (activeDropdownId.value === id) {
            closeDropdown()
        } else {
            openDropdown(id)
        }
    }

    return {
        activeDropdownId,
        openDropdown,
        closeDropdown,
        toggleDropdown
    }
}