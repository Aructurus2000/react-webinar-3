import React from 'react';
import './styles.css';

function App({ store }) {
  const list = store.getState().list;

  const handleItemClick = (code, event) => {
    const isMultiSelect = event.ctrlKey || event.metaKey;
    store.selectItem(code, isMultiSelect);
  };

  return (
    <div className="App">
      <div className="App-head">
        <h1>Приложение на чистом JS</h1>
      </div>
      <div className="App-controls">
        <button onClick={() => store.addItem()}>Добавить</button>
      </div>
      <div className="App-center">
        <div className="List">
          {list.map(item => (
            <div key={item.code} className="List-item">
              <div
                className={'Item' + (item.selected ? ' Item_selected' : '')}
                onClick={event => handleItemClick(item.code, event)}
              >
                <div className="Item-code">{item.code}</div>
                <div className="Item-title">
                  {item.title}
                  {item.selected && item.selectionOrder !== null && (
                    <div className="Item-selection-order">
                      Порядковый номер выделения: {item.selectionOrder}
                    </div>
                  )}
                </div>
                <div className="Item-actions">
                  <button onClick={() => store.deleteItem(item.code)}>Удалить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
