export default function Pagination(props) {
        return (
            <nav aria-label="Template log table navigation">
                <ul className="pagination">
                    <li className={`page-item ${props.current === 1 ? "disabled" : ""}`} onClick={() => {props.onChangePage(props.current - 1)}}><a className="page-link" href="#">Previous</a></li>
                    {[...Array(props.max).keys()].map((i) => {
                        let page = i + 1;
                        return <li key={page} className={`page-item ${props.current === page ? "active" : ""}`} onClick={() => {props.onChangePage(page)}}><a className="page-link" href="#">{page}</a></li>
                    })}
                    <li className={`page-item ${props.current === props.max ? "disabled" : ""}`} onClick={() => {props.onChangePage(props.current + 1)}}><a className="page-link" href="#">Next</a></li>
                </ul>
            </nav>

        )
}