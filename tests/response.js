/* Setting the response mock up object */
const Response = () => {
    return {
        url: "",
        locals: {},
        redirect (urlRedirect) {
            this.url = this.urlRedirect;
        },
        render (view, viewData) {
            this.view = view;
            this.viewData = viewData;
        },
        redirect (url) {
            this.url = url;
        }
    };
};

export default Response;
