export default function Pagination(props) {
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${props.current === 1 ? "disabled" : ""}`} onClick={() => {props.onChangePage(props.current - 1)}}><a className="page-link" href="#">Previous</a></li>
                    {[...Array(props.max).keys()].map((i) => {
                        return <li className={`page-item ${props.current === i + 1 ? "active" : ""}`} onClick={() => {props.onChangePage(i + 1)}}><a className="page-link" href="#">{i + 1}</a></li>
                    })}
                    <li className={`page-item ${props.current === props.max ? "disabled" : ""}`} onClick={() => {props.onChangePage(props.current + 1)}}><a className="page-link" href="#">Next</a></li>
                </ul>
            </nav>

        )
}