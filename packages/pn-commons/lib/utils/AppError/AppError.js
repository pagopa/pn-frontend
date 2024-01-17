class AppError {
    constructor(error) {
        this.code = error.code;
        this.element = error.element || '';
        this.detail = error.detail || '';
    }
    getErrorDetail() {
        return {
            code: this.code,
            element: this.element,
            detail: this.detail,
        };
    }
    getResponseError() {
        return {
            code: this.code,
            element: this.element,
            detail: this.detail,
            message: {
                title: this.getMessage().title,
                content: this.getMessage().content,
            },
        };
    }
}
export default AppError;
