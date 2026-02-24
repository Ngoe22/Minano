class Exam {
    static type = {
        CHOUKAI: `聴解 (ちょうかい)`,
        DOKKAI: `読解(どっかい)`,
        BUNPO: `文法(ぶんぽう)`,
        KANJI: `漢字(かんじ)`,
    };

    static lesson = {
        N5: { lessonS: 18, lessonE: 25 },
        // N4: { lessonS: 26, lessonE: 50 },
    };

    static makeAnode(idName, tag = `div`) {
        const node = document.createElement(tag);
        node.id = idName;
        node.className = idName;
        return node;
    }

    constructor(idName, parentE) {
        //
        this.id = idName;
        this.mainNode = Exam.makeAnode(idName);
        this.filterNode = Exam.makeAnode(`${idName}-filter`);
        this.examNode = Exam.makeAnode(`${idName}-exam`);
        //
        parentE.append(this.mainNode);
        this.mainNode.append(this.filterNode, this.examNode);

        this.examNode.onclick = (e) => {};
    }

    filterRender() {
        //
        const prefix = this.id;
        let head = ``;
        let body = ``;

        const list = Object.entries(Exam.lesson);
        const typeList = Object.entries(Exam.type);

        for (let [key, value] of list) {
            //
            const start = value.lessonS;
            const end = value.lessonE;

            let lessonHtml = ``;
            for (let i = start; i <= end; i++) {
                lessonHtml += `<label class="${prefix}-filter-lesson" ><input hidden type="radio" data-${prefix}-value="${i}" name="${prefix}-lesson" />${i}</label>`;
            }

            let examTypeHtml = ``;
            for (let [roma, kanji] of typeList) {
                examTypeHtml += `<label class="${prefix}-filter-type" ><input hidden type="radio" data-${prefix}-value="${roma}" name="${prefix}-type" />${kanji}</label>`;
            }

            const d = key === `N5` ? `${prefix}-active` : ``;

            head += ` <div class="${prefix}-filter-level ${d}" data-${prefix}-value="${key}">${key}</div>  `;
            body += ` <div class="${prefix}-filter-card ${d}" data-${prefix}-value="${key}">
                <div class="${prefix}-filter-lessons" > ${lessonHtml} </div> 
                <div class="${prefix}-filter-types" > ${examTypeHtml} </div> 
            </div>  `;
        }

        this.filterNode.innerHTML = `
            <div class="${prefix}-filter-levels" >${head}</div>  
            <div class="${prefix}-filter-cards" >${body}</div>  
            <div class="${prefix}-filter-btns" >
                <button class="${prefix}-filter-btn ${prefix}-cancel" >キャンセル</button>
                <button class="${prefix}-filter-btn  ${prefix}-submit" >送信</button>
            </div>  
        `;

        this.filterNode.onclick = async (e) => {
            const target = e.target;
            const CL = target.classList;

            if (
                CL.contains(`${this.id}-filter-level`) &&
                !CL.contains(`${this.id}-active`)
            ) {
                this.filterUncheck();

                // clear active
                this.filterNode
                    .querySelectorAll(`.${this.id}-active`)
                    .forEach((node) => {
                        node.classList.remove(`${this.id}-active`);
                    });

                // add active
                const value = target.getAttribute(`data-${this.id}-value`);
                target.classList.add(`${this.id}-active`);
                this.filterNode
                    .querySelector(
                        `.${this.id}-filter-card[data-${this.id}-value="${value}"]`,
                    )
                    .classList.add(`${this.id}-active`);
            } else if (CL.contains(`${this.id}-cancel`)) {
                this.filterUncheck();
            } else if (CL.contains(`${this.id}-submit`)) {
                // this.filterHide(true);
                const obj = this.filterGetPicked();

                if (!obj.lesson) {
                    this.filterHighlightUnpick(
                        `.${this.id}-filter-lesson`,
                        100,
                    );
                    return;
                }
                if (!obj.type) {
                    this.filterHighlightUnpick(`.${this.id}-filter-type`, 400);
                    return;
                }

                // return;
                const data = await import(
                    `../EXAM/${obj.level}/${obj.level}-data.js`
                );

                const renderData =
                    data.default[obj.type][`lesson${obj.lesson}`];

                if (!renderData) {
                    shareModal.open({
                        title: `すみません`,
                        body: `～　データが存在しません。`,
                        submit: `わかった`,
                    });
                    return;
                }

                MinanoQuiz.render(this.examNode, renderData);
                document.body.append(captureBtn);
                //
                // this.filterUncheck();
            }
        };
    }

    filterUncheck() {
        const list = this.filterNode.querySelectorAll(`input:checked`);
        if (list)
            list.forEach((node) => {
                node.checked = false;
            });
    }
    filterHide(value) {
        if (value) {
            this.filterNode.style.display = "none";
        } else {
            this.filterNode.style.display = "";
        }
    }
    filterGetPicked() {
        const obj = {};
        obj.level = this.filterNode
            .querySelector(`.${this.id}-filter-level.${this.id}-active`)
            ?.getAttribute(`data-${this.id}-value`);
        for (let key of [`lesson`, `type`]) {
            obj[key] = this.filterNode
                .querySelector(
                    `.${this.id}-filter-card.${this.id}-active  [name="${this.id}-${key}"]:checked`,
                )
                ?.getAttribute(`data-${this.id}-value`);
        }
        return obj;
    }

    async filterHighlightUnpick(selector, time) {
        const list = Array.from(this.filterNode.querySelectorAll(selector));

        for (let node of list) {
            node.classList.add(`warning-red`);
            await this.delay(time);
            node.classList.remove(`warning-red`);
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    examRender() {}
}

const MinanoExamPage = new Exam(`exp`, document.body);
MinanoExamPage.filterRender();

// =========================================

const captureBtn = Exam.makeAnode(`captureBtn`, `button`);
captureBtn.textContent = `宿題を撮る（しゅくだいをとる）📷`;

captureBtn.addEventListener("click", async () => {
    const target = document.querySelector(".exp-exam"); // 🔥 sửa chỗ này

    const audioList = document.querySelectorAll(`audio`);
    const imgList = document.querySelectorAll(`img`);
    const fullHeightList = document.querySelectorAll(`.Minano-card-body`);

    captureBtn.style.display = "none";
    MinanoExamPage.filterNode.style.display = "none";
    audioList.forEach((e) => (e.style.display = "none"));
    imgList.forEach((e) => (e.style.display = "none"));
    fullHeightList.forEach((e) => (e.style.maxHeight = "none"));

    const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
    });

    captureBtn.style.display = "";
    MinanoExamPage.filterNode.style.display = "";
    audioList.forEach((e) => (e.style.display = ""));
    imgList.forEach((e) => (e.style.display = ""));
    fullHeightList.forEach((e) => (e.style.maxHeight = ""));

    console.log(canvas.height);

    if (canvas.height > 1800) {
        const halfHeight = Math.floor(canvas.height / 2);

        var newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");

        newCanvas.width = canvas.width * 2;
        newCanvas.height = halfHeight;

        // phần trên
        ctx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            halfHeight,
            0,
            0,
            canvas.width,
            halfHeight,
        );

        // phần dưới
        ctx.drawImage(
            canvas,
            0,
            halfHeight,
            canvas.width,
            halfHeight,
            canvas.width,
            0,
            canvas.width,
            halfHeight,
        );
    } else {
        var newCanvas = canvas;
    }

    const link = document.createElement("a");
    link.download = "merged.jpg";
    link.href = newCanvas.toDataURL("image/jpeg", 0.95);
    link.click();
});

//  <button id="captureBtn" ></button>
