
import '../assets/styles/footer.styl'

export default {
    data() {
        return {
            github: "hsu1943/justTodo"
        }
    },
    render() {
        return (
            <div id="footer">
                <span>Github: 
                    <a href="https://github.com/hsu1943/justTodo"> {this.github}</a>
                </span>
            </div>
        )
    }
}