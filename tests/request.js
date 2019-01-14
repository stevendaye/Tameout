/* Setting up the Request mock up object */
const Request = () => {
    return {
        logoutCalled: false,
        flashCalled: false,
        body: {},
        session: {
            isAuthenticated: false,
            passport: {}
        },
        logout () {
            this.logoutCalled = true
        },
        flash (f, m) {
            this.flashName = f;
            this.flashMessage = m;
            this.flashCalled = true;
            return f;
        },
        csrfToken () {
            return "csrf";
        }
    };
};

export default Request;
