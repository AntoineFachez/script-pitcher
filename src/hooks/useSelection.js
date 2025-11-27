import { useState, useCallback } from "react";

/**
 * Custom hook to manage selection state.
 * @param {any} initialValue - The initial selected item.
 * @returns {object} - { selected, select, clear }
 */
export function useSelection(initialValue = null) {
    const [selected, setSelected] = useState(initialValue);

    const select = useCallback((item) => {
        setSelected(item);
    }, []);

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    return { selected, select, clear, setSelected };
}
