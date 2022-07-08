import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "please enter value", "danger");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      showAlert(true, "item changed", "success");
    } else {
      showAlert(true, "item added", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
    }
    setName("");
    setEditID(null);
    setIsEditing(false);
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };
  const clearItems = () => {
    showAlert(true, "empty list", "danger");
    setList([]);
  };

  const removeAlert = () => {
    showAlert(false, "", "");
  };

  const editItem = (id) => {
    setIsEditing(true);
    const edit = list.find((item) => item.id === id);
    setName(edit.title);

    setEditID(id);
  };

  const removeItem = (id) => {
    showAlert(true, "Item removed", "danger");
    const newItems = list.filter((item) => {
      return item.id !== id;
    });
    setList(newItems);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      {alert.show && <Alert list={list} removeAlert={removeAlert} {...alert} />}
      <form className="grocery-form" onSubmit={handleSubmit}>
        <h3>Shoping buddy</h3>
        <div className="form-control">
          <input
            type="text"
            placeholder="e.g. eggs"
            className="grocery"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List editItem={editItem} removeItem={removeItem} items={list} />
          <button className="clear-btn" onClick={clearItems}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
};

export default App;
