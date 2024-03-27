import React from 'react'

const UserIdPage = (props) => {
  return (
    <div>
        {props.userId}
    </div>
  )
}

export default UserIdPage

export async function getServerSideProps(context) {
    const { params } = context
    const uid = params.uid

    return {
        props: {
            userId: 'userId-' + uid
        }
    }
}