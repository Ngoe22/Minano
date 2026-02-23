class Keyboard {
    static KATAKANA_main = [
        ["ア", "イ", "ウ", "エ", "オ"],
        ["カ", "キ", "ク", "ケ", "コ"],
        ["サ", "シ", "ス", "セ", "ソ"],
        ["タ", "チ", "ツ", "テ", "ト"],
        ["ナ", "ニ", "ヌ", "ネ", "ノ"],
        ["ハ", "ヒ", "フ", "ヘ", "ホ"],
        ["マ", "ミ", "ム", "メ", "モ"],
        ["ラ", "リ", "ル", "レ", "ロ"],
        ["ヤ", "ユ", "ヨ", "〃", "○"],
        ["ャ", "ュ", "ョ", "ッ", `ン`],
        ["ワ", "ヲ", " ", "/", `↵`],
    ];
    static HIRAGANA_main = [
        ["あ", "い", "う", "え", "お"],
        ["か", "き", "く", "け", "こ"],
        ["さ", "し", "す", "せ", "そ"],
        ["た", "ち", "つ", "て", "と"],
        ["な", "に", "ぬ", "ね", "の"],
        ["は", "ひ", "ふ", "へ", "ほ"],
        ["ま", "み", "む", "め", "も"],
        ["ら", "り", "る", "れ", "ろ"],
        ["や", "ゆ", "よ", "〃", "○"],
        ["ゃ", "ゅ", "ょ", "っ", `ん`],
        ["わ", "を", " ", "/", `↵`],
    ];
    static All_maRu = {
        // hiragana
        は: "ぱ",
        ひ: "ぴ",
        ふ: "ぷ",
        へ: "ぺ",
        ほ: "ぽ",

        // katakana
        ハ: "パ",
        ヒ: "ピ",
        フ: "プ",
        ヘ: "ペ",
        ホ: "ポ",
    };
    static All_tenTen = {
        // hiragana

        か: "が",
        き: "ぎ",
        く: "ぐ",
        け: "げ",
        こ: "ご",

        さ: "ざ",
        し: "じ",
        す: "ず",
        せ: "ぜ",
        そ: "ぞ",

        た: "だ",
        ち: "ぢ",
        つ: "づ",
        て: "で",
        と: "ど",

        は: "ば",
        ひ: "び",
        ふ: "ぶ",
        へ: "べ",
        ほ: "ぼ",

        // katakana

        カ: "ガ",
        キ: "ギ",
        ク: "グ",
        ケ: "ゲ",
        コ: "ゴ",

        サ: "ザ",
        シ: "ジ",
        ス: "ズ",
        セ: "ゼ",
        ソ: "ゾ",

        タ: "ダ",
        チ: "ヂ",
        ツ: "ヅ",
        テ: "デ",
        ト: "ド",

        ハ: "バ",
        ヒ: "ビ",
        フ: "ブ",
        ヘ: "ベ",
        ホ: "ボ",
    };

    static alphabetKeyboard = [
        ["A", "B", "C", "D", "E"],
        ["F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O"],
        ["P", "Q", "R", "S", "T"],
        ["U", "V", "W", "X", "Y"],
        ["Z", "", "", "/", `↵`],
    ];

    static list = [
        Keyboard.KATAKANA_main,
        Keyboard.HIRAGANA_main,
        Keyboard.alphabetKeyboard,
    ];

    constructor(idName) {
        this.keyboard = document.createElement(`div`);
        this.keyboard.id = idName;
        this.idName = idName;
        this.keyboardIndex = 0;
    }

    //

    renderKeyboard() {
        const letterBoard = Keyboard.list[this.keyboardIndex];
        let html = ``;
        const idName = this.idName;
        for (let row of letterBoard) {
            let rowHtml = ``;
            for (let i in row) {
                rowHtml += `
                <div class="${idName}-letter" data-${idName}-value="${row[i]}">${row[i]}</div>`;
            }
            html += `
        <div class="${idName}-row">${rowHtml}</div>`;
        }
        this.keyboard.innerHTML =
            html +
            `<div class="${idName}-row">
                <div class="${idName}-switch"  data-${idName}-value ="switch">↹</div>
                <div class="${idName}-delete"  data-${idName}-value ="delete"></div>
                <div class="${idName}-space"  data-${idName}-value ="space"></div>
                <div class="${idName}-done"  data-${idName}-value ="done">⇒</div>
            </div>`;
    }

    async keyboardToggle(enterTextNode) {
        if (this.temp === undefined) {
            this.temp = await shareModal.open({
                title: `すみません`,
                body: `～　どなキーボードを使いたいですか　❓`,
                submit: `スマホ`,
                cancel: `ウェブ`,
            });
        }
        switch (this.temp) {
            case false:
                this.webKeyboard(enterTextNode);
                break;
            case true:
                this.selfKeyboard(enterTextNode);
                break;
        }
    }

    selfKeyboard(enterTextNode) {
        enterTextNode.contentEditable = true;
        enterTextNode.focus();
    }

    webKeyboard(enterTextNode) {
        if (enterTextNode) {
            //
            if (this.focus)
                this.focus.classList.remove(`${this.idName}-active`);
            this.focus = enterTextNode;
            enterTextNode.classList.add(`${this.idName}-active`);

            //

            document.body.append(this.keyboard);
            this.renderKeyboard();
            this.extendHeight(true);

            const y =
                enterTextNode.getBoundingClientRect().top +
                window.scrollY -
                window.innerHeight * 0.2;
            window.scrollTo({
                top: y,
                behavior: "smooth",
            });

            this.keyboard.onclick = (e) => {
                const letter = e.target.getAttribute(
                    `data-${this.idName}-value`,
                );
                if (!letter) return false;
                this.handleKeyboard(letter, enterTextNode);
            };
        } else {
            this.keyboard.remove();
            this.focus.classList.remove(`${this.idName}-active`);
        }
    }

    handleKeyboard(letter, boxNode) {
        if (!letter) return;
        let array = boxNode.innerText.split(``);
        const l = array.length;

        switch (letter) {
            case "delete":
                if (l === 0) return;
                array.pop();
                break;
            case "done":
                this.extendHeight(false);
                this.webKeyboard(false);
                break;
            case "space":
                if (array[l - 1] === `＿`) return;
                array.push(`＿`);
                break;
            case "switch":
                const maxIndex = Keyboard.list.length - 1;
                this.keyboardIndex =
                    this.keyboardIndex === maxIndex
                        ? 0
                        : this.keyboardIndex + 1;
                this.renderKeyboard();
                break;
            case "○":
                const ma = Keyboard.All_maRu[array[l - 1]];
                if (!ma) return;
                array[l - 1] = ma;
                break;
            case "〃":
                const ten = Keyboard.All_tenTen[array[l - 1]];
                if (!ten) return;
                array[l - 1] = ten;
                break;
            case "/":
                array.push(`　/　`);
                break;
            case "↵":
                array.push(`\n`);
                break;
            case "":
                break;
            default:
                array.push(letter);
        }

        console.log(array);

        boxNode.innerText = array.join(``);
    }

    extendHeight(value) {
        if (!this.blankBlock) {
            this.blankBlock = document.createElement(`div`);
            this.blankBlock.style.height = `50vh`;
        }

        if (value) {
            document.body.append(this.blankBlock);
        } else {
            this.blankBlock.remove();
        }
    }
}

const importKeyboard = new Keyboard(`keyboard`);
