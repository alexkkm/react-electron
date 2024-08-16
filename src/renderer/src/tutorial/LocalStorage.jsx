const LocalStorageTutorial = () => {
    /** This is the CRUD example of local storage **/
    const writeLocal = () => {
        // create data in local storage, setItem("key","value"), while "value" can only be string
        localStorage.setItem("field1", JSON.stringify({ abc: 2, def: "24" }));
    }

    const readLocal = () => {
        // read data with specific field "field1" in local storage
        const buf = localStorage.getItem("field1");
        console.log(buf)
    }

    const deleteLocal = () => {
        // delete specific field of data in local storage
        localStorage.removeItem("field1");

    }
    const clearLocal = () => {
        // clear all data in local storage
        localStorage.clear();
    }

    useEffect(() => {
        writeLocal()
        readLocal()
    })

    return (
        <div className="localStorageTutorial">
            <p>This is the local Storage tutorial</p>
        </div>
    )
}


export default LocalStorageTutorial;