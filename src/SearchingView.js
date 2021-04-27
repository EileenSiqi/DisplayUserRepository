import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const  SearchingView = () => {
    const [ isLoading, setIsLoading ] = useState( false );
    const [ userName, setUserName ] = useState( null );
    const [ gridApi, setGridApi ] = useState( null );
    const [ gridColumnApi, setGridColumnApi ] = useState( null );
    const [ rowData, setRowData ] = useState([ ]);
    const [columnDefs, setColumnDefs] = useState([
        { headerName: "Name", field: "name", sortable: true },
        { headerName: "Language", field: "language", sortable: true },
        { headerName: "Fork Count", field: "fork_count", sortable: true }
    ])

    const onGridReady = params => {
        setGridApi( params.api );
        setGridColumnApi( params.columnApi );
    }

    useEffect(() => {
        const loadData = () => {
            setIsLoading( true )
            fetch( "https://api.github.com/users/" + userName + "/repos?type=all&per_page=100" )
                .then( response => response.json() )
                .then( data => {
                    setRowData( data.map(( data ) => ({ 'name': data.name, 'language': data.language, 'fork_count': data.forks_count })))
                    setIsLoading( false )
                })
                .catch( err => {
                    alert( "invalid username" )
                })
        }
        const timeOutId = setTimeout( () => loadData(), 200 );
        return () => clearTimeout( timeOutId );
    }, [ userName ])

    const display = (
        <div className="ag-theme-alpine" style={{ height: window.innerHeight, width: window.innerWidth }}>
            <AgGridReact
                onGridReady={ onGridReady }
                columnDefs={ columnDefs }
                rowData={ rowData }>
            </AgGridReact>
        </div>
    )

    return (
        <div>
            <h1>Displays a given user's public repositories</h1>
            <form>
                <label>Enter your github username: </label>
                <input autoFocus type="text" placeholder="username" onChange={ e => setUserName(e.target.value) }/>
            </form>
            { isLoading ? "loading..." : display }
        </div>
    );
}

export default SearchingView;
