/**
 * An array of templates that are default to creating a
 * new modal in Bootstrap 4.1. This array is also used to
 * change behavior of the modal as the developer requests,
 * such as adding/removing a close button, appending to the
 * footer, etc.
 */
namespace DynModal {
    export const ModalTemplate = {
        DIALOG:
            "<div class='modal fade' tabindex='-1' role='dialog' aria-hidden='true'>" +
            "   <div class='modal-dialog' role='document'>" +
            "       <div class='modal-content'>" +
            "           <div class='modal-header'>" +
            "               <h5 class='modal-title'>Default Title</h5>" +
            "           </div>" +
            "           <div class='modal-body'>" +
            "               <p>This is the default body placeholder for DynModal modals.</p><br />" +
            "               <p>Please use DynModal#setBody(function) to change the contents of this section.</p>" +
            "           </div>" +
            "       </div>" +
            "   </div>" +
            "</div>",

        HEADER: {
            CLOSE_BUTTON:
                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                "   <span aria-hidden='true'>&times;</span>" +
                "</button>"
        },

        FOOTER: {
            BASE:
                "<div class='modal-footer'></div>",
            CLOSE:
                "<button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button>"
        }
    };
}