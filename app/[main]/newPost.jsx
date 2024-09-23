import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'

const NewPost = () => {
  return (
    <ScreenWrapper>
      <Header title="Create Post" />
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({

 container : {
  flex:1,
  marginBottom: 30,
  paddingHorizontal:wp(4),
  gap:15
 },
 title:{
  fontSize: hp(2.5),
  fontWeight: theme.fonts.semibold,
  color:theme.colors.text,
  textAlign:'center'
 },
 header:{
  flexDirection: 'row',
  alignItems: 'center',
  gap:12,

 },
 username:{
  fontSize: hp(2.2),
  fontWeight: theme.fonts.semibold,
  color: theme.colors.text
 },
 ava

})