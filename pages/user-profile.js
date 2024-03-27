import React from 'react'

const UserProfilePage = (props) => {
  return (
    <div>
      {props.username}
    </div>
  )
}

export default UserProfilePage

export async function getServerSideProps(context) {
  const { params, req, res } = context

  return {
    props: {
      username: 'Nuri'
    }
  }
}