export const QUESTION_CARDS = [
  "初めて体験したのはいつ頃？",
  "どんな場所でよく見かける？",
  "値段にすると高い？安い？",
  "子どもと大人、どちらに人気？",
  "季節でたとえるならいつ？",
  "色や形をぼかして表現すると？",
  "家にある？外で楽しむ？",
  "一人と大人数、どちらが向いている？",
  "なくなったら困る？困らない？",
  "五感のうち一番関係するのは？",
  "どんな気分のときに選ぶ？",
  "海外でも通じそう？",
];

export function drawQuestion(previousIndex = null) {
  if (QUESTION_CARDS.length === 0) return { text: "自由に質問しよう", index: null };
  let index = Math.floor(Math.random() * QUESTION_CARDS.length);
  if (QUESTION_CARDS.length > 1 && index === previousIndex) {
    index = (index + 1) % QUESTION_CARDS.length;
  }
  return { text: QUESTION_CARDS[index], index };
}
