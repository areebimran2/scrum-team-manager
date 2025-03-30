import { useEffect, useRef, useState } from "react";
import styles from "./styles/dropdown.module.css";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  className, // Custom class for the dropdown container
  inputClassName, // Custom class for the input element
  optionsClassName, // Custom class for the options container
  arrowClassName, // Custom class for placing the arrow
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    handleChange(option[label]);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className={`${styles.dropdown} ${className || ""}`}> {/* Combine default and custom container classes */}
      <div className={styles.control}>
        <div className={styles.selectedValue}>
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
            className={`${styles.input} ${inputClassName || ""}`} // Combine default and custom input classes
          />
        </div>
        <div className={`${styles.arrow} ${isOpen ? styles.open : ""} ${arrowClassName || ""}`}></div> {/* Combine default and custom arrow classes */}
      </div>

      <div className={`${styles.options} ${isOpen ? styles.open : ""} ${optionsClassName || ""}`}> {/* Combine default and custom options classes */}
        {filter(options).map((option, index) => {
          return (
            <div
              onClick={() => selectOption(option)}
              className={`${styles.option} ${
                option[label] === selectedVal ? styles.selected : ""
              }`}
              key={`${id}-${index}`}
            >
              {option[label]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdown;