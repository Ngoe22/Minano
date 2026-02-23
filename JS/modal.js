class Modal {
    static makeAnode(idName, tag = `div`) {
        const node = document.createElement(tag);
        node.id = idName;
        node.className = idName;
        return node;
    }

    constructor(idName) {
        //
        this.id = idName;

        this.mainNode = Modal.makeAnode(idName);
        this.contentNode = Modal.makeAnode(`${idName}-box`);
        this.titleNode = Modal.makeAnode(`${idName}-title`);
        this.bodyNode = Modal.makeAnode(`${idName}-body`);
        this.btnsNode = Modal.makeAnode(`${idName}-btns`);
        this.cancelNode = Modal.makeAnode(`${idName}-cancel`, `button`);
        this.submitNode = Modal.makeAnode(`${idName}-submit`, `button`);

        this.mainNode.append(this.contentNode);
        this.contentNode.append(this.titleNode, this.bodyNode, this.btnsNode);
    }

    open(obj) {
        return new Promise((resolve) => {
            //
            document.body.append(this.mainNode);

            this.titleNode.innerHTML = obj.title;
            this.bodyNode.innerHTML = obj.body;

            if (obj.cancel) {
                this.btnsNode.append(this.cancelNode);
                this.cancelNode.innerHTML = obj.cancel;
            }
            if (obj.submit) {
                this.btnsNode.append(this.submitNode);
                this.submitNode.innerHTML = obj.submit;
            }

            this.cancelNode.onclick = (e) => {
                this.mainNode.remove();
                resolve(false);
            };

            this.submitNode.onclick = (e) => {
                this.mainNode.remove();
                resolve(true);
            };
        });
    }
}

const shareModal = new Modal(`shareModal`);
