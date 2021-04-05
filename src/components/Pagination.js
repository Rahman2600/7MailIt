export default function Pagination(props) {
        return (
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    {props.current !== 1 ? <li class="page-item" onClick={() => {props.onChangePage(props.current - 1)}}><a class="page-link" href="#">Previous</a></li> : <span></span>}
                    {[...Array(props.max).keys()].map((i) => {
                        return <li class="page-item" onClick={() => {props.onChangePage(i)}}><a class="page-link" href="#">{i}</a></li>
                    })}
                    {props.current < props.max ? <li class="page-item" onClick={() => {props.onChangePage(props.current + 1)}}><a class="page-link" href="#">Next</a></li> : <span></span>}
                </ul>
            </nav>

        )
}