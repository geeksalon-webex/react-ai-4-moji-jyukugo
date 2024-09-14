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
    jukugo: "",
    description: "",
    ruby: "",
    isSuccess: false,
  });

  const [
    generateKanjiDescriptionFeedback,
    setGenerateKanjiDescriptionFeedback,
  ] = useState("");

  const generateKanjiDescription = async () => {
    setGenerateKanjiDescriptionFeedback("");
    if (selectedKanji.length !== 4) {
      setGenerateKanjiDescriptionFeedback("漢字を4つ選んでください");
      return;
    }
    try {
      const input = selectedKanji.join("");
      const response = await fetch(
        "https://generatejukugodescription-5riknzcxfq-an.a.run.app//generateJukugoDescription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        }
      );
      if (!response.ok) {
        setGenerateKanjiDescriptionFeedback(
          "通信中にエラーが発生しました。組み合わせを変えて再度お試しください"
        );
        return;
      }
      const data = await response.json();
      if (!data.isSuccess) {
        setGenerateKanjiDescriptionFeedback(
          "生成に失敗しました。組み合わせを変えて再度お試しください"
        );
        return;
      }
      setGenerateResult(data);
    } catch (error) {
      console.error(error);
      setGenerateKanjiDescriptionFeedback(
        "不明なエラーが発生しました。再度お試しください"
      );
    }
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
          <div className="kanji-container mx-auto">
            <div className="grid-selected-kanji">
              {selectedKanji.map((kanji, i) => (
                <span key={i}>{kanji}</span>
              ))}
            </div>
            {generateResult.isSuccess && (
              <>
                <h2>（{generateResult.ruby}）</h2>
                <p>解説：{generateResult.description}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="generate-kanji-description mx-auto">
        <div>
          <p>
            <button onClick={() => generateKanjiDescription()}>
              👉 4文字熟語の説明を見る
            </button>
          </p>
          {generateKanjiDescriptionFeedback !== "" && (
            <p role="alert">{generateKanjiDescriptionFeedback}</p>
          )}
        </div>

        <button
          className="shuffle-kanji-button"
          onClick={() => randomizeKanjiList()}
        >
          漢字をシャッフルする
        </button>
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
