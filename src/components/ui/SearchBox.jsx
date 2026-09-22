import { Search, X } from "lucide-react";

function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="page-search">
      <Search size={19} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {value && (
        <button
          type="button"
          className="page-search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

export default SearchBox;