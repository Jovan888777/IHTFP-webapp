import React, { useState, useEffect } from "react";
import "./KeywordInput.css";

const KeywordInput = (props) => {
  const [keywords, setKeywords] = useState([]);

  const loadKeywords = () => {
    setKeywords(props.data);
    let inputField = document.getElementsByClassName(props.classNameUsed)[0];
    for (let index in props.data) {
      inputField.parentNode.insertBefore(createFilterItem(props.data[index]), inputField);
      inputField.value = "";
    }
  };

  const removeKeyword = (event) => {
    let newKeywords = keywords.filter((keyword) => keyword !== event.target.value);
    setKeywords(newKeywords);
    props.parentFXN(newKeywords);
    event.target.parentNode.remove();
  };

  const createFilterItem = (text) => {
    const item = document.createElement("div");
    item.className = "multi-search-item";

    const span = document.createElement("span");
    span.innerHTML = text;

    const close = document.createElement("div");
    close.className = "fa fa-close";
    close.addEventListener("click", (e) => removeKeyword(e));

    item.appendChild(span);
    item.appendChild(close);
    return item;
  };

  const multiSearchKeyup = (event) => {
    if (event.keyCode === 13) {
      event.target.parentNode.insertBefore(createFilterItem(event.target.value), event.target);
      let newKeywords;
      if (Array.isArray(keywords)) {
        newKeywords = [...keywords];
      } else {
        newKeywords = [];
      }
      newKeywords.push(event.target.value);
      setKeywords(newKeywords);
      props.parentFXN(newKeywords);
      event.target.value = "";
    }
  };

  useEffect(() => {
    loadKeywords();
  }, [props.data]);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div
        className="multi-search-filter"
        onClick={(e) => {
          let children = Array.from(e.target.children);
          if (children.length !== 0) {
            children.find((n) => n.tagName === "INPUT").focus();
          } else {
            if (e.target.tagName === "INPUT") {
              e.target.focus();
            }
          }
        }}
      >
        <input type="text" className={props.classNameUsed} onKeyUp={(e) => multiSearchKeyup(e)} />
      </div>
    </div>
  );
};

export default KeywordInput;
