import React from 'react'
import { Avatar, Flex } from '@chakra-ui/react'
import { TextField } from '@material-ui/core'
import { auth } from '../firebase/init_firebase'
import "./styles/general.css"

const General = () => {

  return (
    <Flex className="general__main">
        <h1>PROFIL</h1>

        <Flex className="general__form">
            <div className='general__avatar'>
                <Avatar className="avatar" alt="Avatar" src={auth.currentUser.photoURL} width="200px" height="200px" />
            </div>

            <TextField 
                variant="outlined"
                label="Nom d'utilisateur"
                type="text"
                margin="normal"
                className="general__textBox"
                defaultValue={auth.currentUser.displayName}
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField 
                variant="outlined"
                label="Adresse mail"
                type="text"
                margin="normal"
                className="general__textBox"
                defaultValue={auth.currentUser.email}
                InputProps={{
                    readOnly: true,
                }}
            />
        </Flex>
    </Flex>
  )
}

export default General