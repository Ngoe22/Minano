class QuizLib {
    constructor(name, containerClassName) {
        this.name = name;
        this.CLN = containerClassName;
    }

    // render

    render(containerNode, list) {
        const CLN = this.CLN;
        let html = ``;
        for (let i in list) {
            // declare

            const currentCard = list[i];
            const MQ = currentCard.MQ;
            const sideQA = currentCard.Each;
            const lazyInputNum = currentCard?.lazyInput;
            const lazyRadio = currentCard?.lazyRadio;

            // handle header

            let headerHtml = this.getQuestionHtml(MQ, `${CLN}-header`);
            if (headerHtml)
                headerHtml = `<div class="${CLN}-card-header"> ${headerHtml} </div>`;

            // handle body

            let bodyHtml = ``;

            // lazy
            if (lazyInputNum) {
                let AHtml = ``;
                let QHtml = ``;
                for (let j = 1; j <= lazyInputNum; j++) {
                    QHtml = `<p class="${CLN}-text">${j} )</p>`;
                    AHtml = `<div class="${CLN}-input-box"><p class="${CLN}-text-box"></p><button class=" ${CLN}-open-keyboard  call-the-keyboard"></button></div>`;

                    bodyHtml += `<div class="${CLN}-QA">
                        <div class="${CLN}-Q"> ${QHtml}  </div>
                        <div class="${CLN}-A"> ${AHtml}  </div>
                    </div>`;
                }
            }


            // specific
            for (let j in sideQA) {
                //
                const QAObj = sideQA[j];
                const answerOPtions = QAObj.O;
                let AHtml = ``;

                // console.log(QAObj.type);

                switch (QAObj.type) {
                    case "quiz":
                        for (let k in answerOPtions) {
                            AHtml += `<label class="${CLN}-A-op" > <input hidden type="radio" name="${i}-${j}" />${answerOPtions[k]}</label >`;
                        }
                        break;
                    case "input":
                        AHtml += `<div class="${CLN}-input-box"><p class="${CLN}-text-box"></p><button class=" ${CLN}-open-keyboard  call-the-keyboard"></button></div>`;
                        break;
                }

                let q = this.getQuestionHtml(QAObj.Q, `${CLN}-Q`);
                q = q ? `<div class="${CLN}-Q"> ${q}  </div>` : ``;
                bodyHtml += `<div class="${CLN}-QA">
                    <div class="${CLN}-Q"> ${q}  </div>
                    <div class="${CLN}-A"> ${AHtml}  </div>
                </div>`;
            }

            // final
            html += `<div class="${CLN}-card"> 
                ${headerHtml} 
                <div class="${CLN}-card-body">  ${bodyHtml}</div>
            </div>`;
        }

        containerNode.innerHTML = html;
    }

    getQuestionHtml(obj, classPrefix) {
        if (!obj) return;
        const outImg = obj.img
            ? `<img src="${obj.img}" class="${classPrefix}-img" />`
            : ``;
        const outputAudio = obj.audio
            ? `<audio controls src="${obj.audio}" class="${classPrefix}-audio">  </audio>`
            : ``;
        const outputText = obj.text
            ? `<p class="${classPrefix}-text">${obj.text}</p>`
            : ``;

        return `${outputText} ${outImg} ${outputAudio}`.trim();
    }

    // checking

    checkResult() {}
}

const MinanoQuiz = new QuizLib(`Minano`, `Minano`);
