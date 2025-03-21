/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = [];
    this.maxCode = Math.max(0, ...initState.list.map(item => item.code));
    this.selectionOrder = []; // Массив для хранения порядка выделения
  }


  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
// Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
// Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.maxCode + 1;
    this.maxCode = newCode;
    this.setState({
      ...this.state,
      list: [...this.state.list, {code: newCode, title: 'Новая запись', selectionCount: 0}],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   * @param isMultiSelect {Boolean} Флаг множественного выделения
   */
  selectItem(code, isMultiSelect = false) {
    let newSelectionOrder = [...this.selectionOrder];

    if (!isMultiSelect) {
      // Если множественное выделение не используется, сбрасываем все выделения
      newSelectionOrder = [];
    }

    const updatedList = this.state.list.map(item => {
      if (item.code === code) {
        const isSelected = !item.selected;
        if (isSelected) {
          // Добавляем код элемента в массив порядка выделения
          newSelectionOrder.push(code);
        } else {
          // Удаляем код элемента из массива порядка выделения
          newSelectionOrder = newSelectionOrder.filter(c => c !== code);
        }
        return {
          ...item,
          selected: isSelected,
          selectionOrder: isSelected ? newSelectionOrder.length : null,
        };
      } else if (!isMultiSelect) {
        return {...item, selected: false, selectionOrder: null};
      }
      return item;
    });

    // Обновляем состояние и массив порядка выделения
    this.selectionOrder = newSelectionOrder;
    this.setState({
      ...this.state,
      list: updatedList.map(item => ({
        ...item,
        selectionOrder: item.selected ? newSelectionOrder.indexOf(item.code) + 1 : null,
      })),
    });
  }
}

  export default Store;
