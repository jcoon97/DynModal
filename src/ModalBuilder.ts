namespace DynModal {
    /**
     * An enumeration of all of the sections (with `div`s as delimiters),
     * that can be used within the ModalBuilder to manipulate and subsequently
     * create a new modal upon request.
     */
    export enum ModalSection {
        BASE = "",
        DIALOG = "div.modal-dialog",
        CONTENT = "div.modal-content",
        HEADER = "div.modal-header",
        HEADER_TITLE = "div.modal-header h5.modal-title",
        BODY =  "div.modal-body",
    }

    export class ModalBuilder {
        /**
         * The internal modal DOM object that is manipulated and, once
         * create() has been called, will also be returned
         */
        private readonly $modal: JQuery<HTMLElement>;

        /**
         * Create a new instance of ModalBuilder
         *
         * @param id the id of the modal to show in the DOM
         */
        constructor(id: number) {
            let $modal = $(ModalTemplate.DIALOG);
            $modal.attr("id", "dynmodal-" + id);

            this.$modal = $modal;
        }

        /**
         * Add a class to the specified section of the DOM object.
         *
         * @param section the section to append the class; can also be a
         * SizzleJS (jQuery) DOM CSS selector, as well
         * @param clazz the name of the class (or classes) to append
         */
        public addClass(section: string, clazz: string): ModalBuilder {
            this.isNull(section,
                () => this.$modal.addClass(clazz),
                () => this.$modal.find(section).addClass(clazz));
            return this;
        }

        /**
         * Append the specified object to the DOM element found by searching
         * for the specified section. If set, empty all of the contents of
         * the DOM element first before appending the new object.
         *
         * @param section the section to search for before appending
         * @param emptyFirst if true, empty the contents before appending
         * @param object the object that will be appended after the two
         * aforementioned actions have been completed
         */
        public append(section: ModalSection, emptyFirst: boolean, object: JQuery<HTMLElement>): ModalBuilder {
            this.isNull(section,
                () => this.isTrue(emptyFirst,
                    () => this.$modal.empty().append(object),
                    () => this.$modal.append(object)),
                () => this.isTrue(emptyFirst,
                    () => this.$modal.find(section).empty().append(object),
                    () => this.$modal.find(section).append(object)));
            return this;
        }

        /**
         * Create and return the jQuery modal object
         */
        public create(): JQuery<HTMLElement> {
            return this.$modal;
        }

        /**
         * Remove the specified class from the specified section
         *
         * @param section the section to search for before removing the class
         * @param clazz the class (or classes) name(s) to remove
         */
        public removeClass(section: ModalSection, clazz: string): ModalBuilder {
            this.isNull(section, () => this.$modal.removeClass(clazz), () => this.$modal.find(section).removeClass(clazz));
            return this;
        }

        /**
         * Set the text of the specified string in the DOM object
         *
         * @param section the section to search for before changing the text
         * @param text the text to change the contents once it has been found
         */
        public setText(section: ModalSection, text: string): ModalBuilder {
            this.isNull(section, () => this.$modal.text(text), () => this.$modal.find(section).text(text));
            return this;
        }

        /**
         * THE FOLLOWING ARE INTERNAL FUNCTIONS THAT ARE ONLY NECESSARY FOR
         * MODALBUILDER. DO NOT MAKE THESE PUBLIC, AS THEY SHOULD NOT BE USED
         * BY ANY ANOTHER CLASS OR SCRIPT.
         */
        private isNull = (obj: any, isNull: () => void, notNull: () => void): void => {
            if(obj == undefined || (<string> obj).length == 0) isNull(); else notNull();
        };

        private isTrue = (flag: boolean, isTrue: () => void, isFalse: () => void): void => {
            if(flag) isTrue(); else isFalse();
        };
    }
}