namespace DynModal {
    /**
     * A list of keys to be used when adding, retrieving, and
     * removing parts of the modal to/from the SectionManager.
     */
    export enum SectionKey {
        HEADER_TITLE = "HEADER.TITLE",
        HEADER_SHOW_CLOSE_BUTTON = "HEADER.SHOW_CLOSE_BUTTON",
        BODY = "BODY",
        FOOTER = "FOOTER"
    }

    /**
     * A simple class that containing a read-only array that allows
     * the developer to easily add key/value pair(s) to/from, as
     * well as checking if key exists, a getter, and removal tool.
     */
    export class SectionManager {
        private readonly sections: any;

        constructor(sections?: any) {
            this.sections = (sections != undefined ? sections : {});
        }

        public add(key: any, value: any): void {
            this.sections[key] = value;
        }

        public get(key: string): any | null {
            if(!this.has(key)) return null;
            return this.sections[key];
        }

        public has(key: string): boolean {
            return this.sections[key] != undefined;
        }

        public isTrue(key: string): boolean {
            return (this.has(key) && this.get(key) == true);
        }

        public remove(key: string): boolean {
            if(!this.has(key)) return false;
            delete this.sections[key];
            return true;
        }
    }
}