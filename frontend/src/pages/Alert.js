function Alert( { isVisible }) {
    if (isVisible) {
        return (

            <div class="alert alert-danger" role="alert">
                The room is full
            </div>

        );
    }
    return;
}
export default Alert;