namespace DynModal {
    export class Core {
        private DEFAULTS = {
            /**
             * If true, the modal will be vertically centered in the page
             */
            centerVertically: false,

            /**
             * If true, the modal will open without any animation
             */
            removeAnimation: false,

            /**
             * Specifies the size of the modal when it opens. Can be any
             * option specified in MODAL_SIZES; however, if no option is
             * chosen, then it will default to the default size
             */
            size: ModalSize.DEFAULT,

            /**
             * Specifies a callback function that will called when the
             * modal has been built via the #build() function. Note that
             * this callback will also be called if #buildAndShow is invoked,
             * as well.
             */
            onBuilt: null,

            /**
             * Specified a callback function that will be called when we
             * have called the <code>show</code> function and Bootstrap
             * has informed us that the modal is now fully shown to the user
             */
            onShown: null,

            /**
             * Specified a callback function that will be called when we
             * have called the <code>hide</code> function or when the user
             * has closed out the modal manually and Bootstrap has informed us
             */
            onHidden: null
        };

        private id: number;
        private currentModal: JQuery<HTMLElement>|null;

        private readonly options: any;
        private readonly sectionManager: SectionManager;

        /**
         * Creates a new instance of DynModal's Core class.
         *
         * @param options an array of options, as defined in DEFAULTS
         */
        constructor(options: any) {
            // @ts-ignore
            if (!window.jQuery) {
                throw "DynModal must be loaded after jQuery is already present on the page.";
            }

            this.id = 1;
            this.currentModal = null;

            this.options = $.extend({}, this.DEFAULTS, options);
            this.sectionManager = new SectionManager();
        }

        /**
         * Build the modal and cache it so user may then call
         * #show() or #hide() in the Core class.
         */
        public build(): Core {
            let builder = new ModalBuilder(this.id)
                .addClass(ModalSection.DIALOG, (this.options.centerVertically) ? "modal-dialog-centered" : "")
                .removeClass(ModalSection.BASE, (this.options.removeAnimation) ? "fade" : "")
                .addClass(ModalSection.DIALOG, this.options.size);

            // Change the header title if the user specified
            if(this.sectionManager.has(SectionKey.HEADER_TITLE)) {
                builder = builder.setText(ModalSection.HEADER_TITLE, this.sectionManager.get(SectionKey.HEADER_TITLE));
            }

            // Add the close button if the user specified
            if(this.sectionManager.isTrue(SectionKey.HEADER_SHOW_CLOSE_BUTTON)) {
                let $closeBtn = $(ModalTemplate.HEADER.CLOSE_BUTTON);
                builder = builder.append(ModalSection.HEADER, false, $closeBtn);
            }

            // Add the body text if the user specified
            if(this.sectionManager.has(SectionKey.BODY)) {
                let $body = $(this.sectionManager.get(SectionKey.BODY));
                builder = builder.append(ModalSection.BODY, true, $body);
            }

            // Add the footer if the user specified
            let $footer = $(ModalTemplate.FOOTER.BASE);

            if(this.sectionManager.has(SectionKey.FOOTER)) {
                $footer.empty();

                (<Array<String>> this.sectionManager.get(SectionKey.FOOTER)).forEach((item) => {
                    let $btn = $(item);

                    if($btn.attr("data-close") != undefined) {
                        $btn.removeAttr("data-close");
                        $btn.attr("data-dismiss", "modal");
                        $btn.attr("data-target", "dynmodal-" + this.id);
                    }
                    $btn.appendTo($footer);
                });
            } else {
                $footer.append(ModalTemplate.FOOTER.CLOSE);
            }

            builder = builder.append(ModalSection.CONTENT, false, $footer);
            this.currentModal = builder.create();
            if(typeof this.options.onBuilt == "function") this.options.onBuilt.call(this, this);
            return this;
        }

        /**
         * A convenience method that method that will automatically show
         * the modal immediately after it has been built.
         */
        public buildAndShow(): void {
            this.build();
            this.show();
        }

        /**
         * Get the DynModal ID of the current modal that is/will be shown to the user
         */
        public getId(): number {
            return this.id;
        }

        /**
         * Get the most recently built modal as a jQuery object.
         * If one has not been built yet, an exception will be thrown instead
         */
        public getModal(): JQuery<HTMLElement> {
            if(this.currentModal == null) {
                throw "You must build the modal first before you may retrieve its instance.";
            }
            return this.currentModal;
        }

        /**
         * Grab the modal that is currently being shown to the user. Hide
         * it from the screen, remove the object, and call the onHidden
         * option to inform the developer the modal has been hidden.
         *
         * @param force true if you wish to forcefully close, otherwise false.
         * This flag is useful if the modal was hidden via a button click or
         * programmatically, versus the user clicking outside the viewport
         */
        public hide(force: boolean): void {
            let $modal = this.getModal();
            if(force) $modal.modal("hide");

            $modal.on("hidden.bs.modal", () => {
                if(typeof this.options.onHidden == "function") {
                    this.options.onHidden.call(this, this.getId());
                }

                $modal.remove();
                this.id += 1;
                this.currentModal = null;
            });
        }

        /**
         * Show the modal to the user. This is the core method that takes
         * care of all of the options, appends/removes sections of the modal
         * based on user choice, and more.
         *
         * Once this method is finished, the modal will appear on the user's
         * screen and the onShown option callback will be called.
         *
         * @returns number the instance of the jQuery modal object
         */
        public show(): void {
            if(this.currentModal == null) {
                throw "You must call the #build() function before you may show the modal";
            }

            let $modal = this.getModal();
            $("body").append($modal);

            $modal.modal("show");
            $modal.on("hide.bs.modal", () => this.hide(false));
            $modal.on("shown.bs.modal", () => {
                if(typeof this.options.onShown == "function") {
                    this.options.onShown.call(this, this.getId(), this.getModal());
                }
            });
        }

        /**
         * Set the body of the modal to a raw HTML string. Please keep in
         * mind that, although this method requires that you return a string,
         * that value may be retrieved anywhere you wish.
         *
         * Below are 3 common examples for returning a body:
         *      return "<p>This is my raw HTML</p>";
         *      return document.getElementById("tmplBody").innerHTML;
         *      return $("script#tmplBody").html();
         *
         * @param obj a function that returns a string to be used in place
         * of the modal body
         */
        public setBody(obj: any): Core {
            if(typeof obj == "function") {
                let result = obj.call();

                if((typeof result == "string") || (result instanceof jQuery)) {
                    if(result instanceof jQuery) {
                        result = result.clone();
                    }
                    this.sectionManager.add(SectionKey.BODY, result);
                } else {
                    throw "You must return a valid object. Please review the documentation";
                }
            } else {
                throw "You must pass in an anonymous function as the argument";
            }
            return this;
        }

        /**
         * Set an array of buttons to be shown to the user in the footer
         * of the modal. Please note that it is recommended to pass in an
         * array of "<button></button>" HTML elements; however, any HTML
         * element can be passed in and it will be parsed and shown.
         *
         * Each button element will be parsed and appended as-is; however,
         * there is a special case for if you wish to have a button also
         * close the modal. In this specific situation, you would then
         * append a <code>data-close</code> attribute to the element.
         *
         * An example of the <code>data-close</code> attribute:
         *      <button type='button' class='btn btn-primary' data-close>CLOSE</button>
         *
         * @param buttons a String Array containing the raw HTML code that
         * is necessary to show the buttons
         */
        public setFooter(buttons: Array<String>): Core {
            this.sectionManager.add(SectionKey.FOOTER, buttons);
            return this;
        }

        /**
         * Set the title of the modal that will be shown to the user.
         *
         * @param title the new title of the the modal
         */
        public setHeaderTitle(title: string): Core {
            this.sectionManager.add(SectionKey.HEADER_TITLE, title);
            return this;
        }

        /**
         * Set if the close (times) button should be shown to the user
         * at the top-right of the modal. The default behavior is to not
         * show the button until explicitly requested.
         *
         * @param flag true to show the button, false to hide it
         */
        public setShowCloseButton(flag: boolean): Core {
            this.sectionManager.add(SectionKey.HEADER_SHOW_CLOSE_BUTTON, flag);
            return this;
        }

        /**
         * Convenience method for grabbing the contents of an html element
         * if it is currently wrapped inside of an HTML <template /> tag.
         *
         * @param selector the selector with which to search the DOM
         */
        public static fromTemplate(selector: string): JQuery<HTMLElement> {
            return $($(selector).prop("content"));
        }
    }
}