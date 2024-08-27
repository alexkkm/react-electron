
// the "auth" is used for the functions from package "firebase/auth"
import firebaseTools from "../assets/firebase"
import firebaseImagePath from "../assets/firebase-Icon.png"

import {
    TableRow,
    TableHeaderCell,
    TableHeader,
    TableCell,
    TableBody,
    Table,
    Button,
} from 'semantic-ui-react'


import "./Firebase.css"

const NewFirebasePage = () => {
    return (
        <div className="firebasePage">
            <img src={firebaseImagePath} className="firebaseImage" />
            <p>Trying the real firebase page</p>

            <Table celled striped>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell colSpan='3'>Your Booking</TableHeaderCell>
                    </TableRow>
                    <TableRow>
                        <TableHeaderCell singleLine>Contract Number</TableHeaderCell>
                        <TableHeaderCell singleLine>Site Name</TableHeaderCell>
                        <TableHeaderCell>Address</TableHeaderCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>3</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}

export default NewFirebasePage;