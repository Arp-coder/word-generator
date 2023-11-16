// import { Inter } from 'next/font/google'
import { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
import axios from "axios";

export default function Home() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [browserData, setBrowserData] = useState(false);

  useEffect(() => {
    setBrowserData(localStorage.getItem("words") ? true : false);
  }, []);

  const fetchWordsServer = async () => {
    setLoading(true);
    const res = await axios.get(
      "https://random-word-api.herokuapp.com/word?number=15"
    );
    setWords(res.data);
    setLoading(false);
    console.log(res.data);
  };

  const fetchWordsLocal = () => {
    const words_json = localStorage.getItem("words");
    setWords(JSON.parse(words_json));
  };

  const saveLocal = () => {
    localStorage.setItem("words", JSON.stringify(words));
    setBrowserData(true);
  };

  const deleteLocal = () => {
    localStorage.removeItem("words");
    setBrowserData(false);
  };

  const clearLocal = () => {
    deleteLocal();
    setWords([]);
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    let tempWords = [...words];
    setWords(arrayMove(tempWords, oldIndex, newIndex));
  };

  return (
    <main className={`flex flex-col items-center p-5`}>
      <h1 className="font-medium text-white pt-5 pb-5">WORDS GENERATOR !!!!</h1>
      <div className="flex flex-col items-center" style={{ width: "100%" }}>
        <div className="buttons">
          <button onClick={fetchWordsServer}> Fetch Words</button>
          <button disabled={!browserData} onClick={fetchWordsLocal}>
            {" "}
            Fetch From Browser
          </button>
          <button onClick={saveLocal}> Save Local </button>
          <button disabled={!browserData} onClick={deleteLocal}>
            {" "}
            Delete From Browser
          </button>
          <button onClick={clearLocal}>Clear Data</button>
        </div>
        {loading ? (
          <p className="loading pt-20">Loading....</p>
        ) : (
          <SortableList axis="xy" onSortEnd={onSortEnd} items={words} />
        )}
      </div>
    </main>
  );
}

const SortableList = SortableContainer(({ items }) => {
  return (
    <div className="words pt-10">
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </div>
  );
});

const SortableItem = SortableElement(({ value }) => <p className="word">{value}</p>);
