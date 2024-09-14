import { useState } from "react";
import { KANJI_LIST } from "./kanji-list";
import "./style.css";

const SLICE_COUNT = 100;

export const meta = () => {
  return [
    { title: "あなたの四文字熟語を作ろう" },
    {
      name: "description",
      content:
        "GeekSalon WebExpertコースで生成系AIを紹介するためのサンプルアプリです",
    },
  ];
};

export default function Index() {
  const [selectedKanji, setSelectedKanji] = useState([]);
  const [kanjiList, setKanjiList] = useState(KANJI_LIST.slice(0, SLICE_COUNT));

  /**
   * @param {string} kanji
   */
  const selectKanji = (kanji) => {
    // 4文字になったら末尾の文字を削除して先頭に追加する
    if (selectedKanji.length === 4) {
      setSelectedKanji([
        kanji,
        selectedKanji[0],
        selectedKanji[1],
        selectedKanji[2],
      ]);
      return;
    }
    // それ以外は選択された文字を末尾に追加する
    const newSelectedKanji = [...selectedKanji];
    newSelectedKanji.push(kanji);
    setSelectedKanji(newSelectedKanji);
  };

  const randomizeKanjiList = () => {
    const sortedKanjiList = KANJI_LIST.sort(() => Math.random() - 0.5);
    setKanjiList(sortedKanjiList.slice(0, SLICE_COUNT).sort());
  };

  const [generateResult, setGenerateResult] = useState({
    jyuukugo: "",
    description: "",
    howToRead: "",
    isSuccess: false,
  });

  const generateKanjiDescription = () => {
    setGenerateResult({
      jyuukugo: "古今東西",
      description: "古今東西古今東西古今東西",
      howToRead: "ここんとうざい",
      isSuccess: true,
    });
  };

  return (
    <main>
      <div className="mx-auto explanation-container">
        <div>
          <h1>あなたの四文字熟語を作ろう</h1>
          <p>4つの漢字を選んでね</p>
        </div>
        <div>
          <h2>あなたの選んだ漢字は</h2>
          <div className="grid-selected-kanji mx-auto">
            {selectedKanji.map((kanji, i) => (
              <span key={i}>{kanji}</span>
            ))}
          </div>
        </div>
        {generateResult.isSuccess && (
          <>
            <div className="generate-result mx-auto">
              <h2>
                <ruby>
                  {generateResult.jyuukugo} <rp>(</rp>
                  <rt>{generateResult.howToRead}</rt>
                  <rp>)</rp>
                </ruby>
              </h2>
              <p>解説：{generateResult.description}</p>
            </div>
          </>
        )}
      </div>
      <div className="generate-kanji-description mx-auto">
        <p>
          <button onClick={() => generateKanjiDescription()}>
            👉 4文字熟語の説明を見る
          </button>
        </p>
        <p>
          <button onClick={() => randomizeKanjiList()}>
            漢字をシャッフルする
          </button>
        </p>
      </div>
      <div className="grid-kanji mx-auto">
        {kanjiList.map((kanji) => (
          <button
            className="select-kanji-button"
            key={kanji}
            onClick={() => selectKanji(kanji)}
          >
            {kanji}
          </button>
        ))}
      </div>
    </main>
  );
}
