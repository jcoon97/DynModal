/**
 * An enumeration specifying the sizes that are allowed to be
 * used when generating a new Bootstrap 4 modal. This is to be
 * used inside of the options pass to the constructor.
 *
 * This value will default to <code>MODAL_SIZES.DEFAULT</code>
 * if none is passed in with the options array.
 */
namespace DynModal {
    export enum ModalSize {
        DEFAULT = "",
        SMALL = "modal-sm",
        LARGE = "modal-lg"
    }
}
