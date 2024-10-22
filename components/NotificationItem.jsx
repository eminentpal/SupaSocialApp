import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { TouchableOpacity } from 'react-native';

const NotificationItem = ({
  item,
  router
}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>NotificationItem</Text>
    </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap:12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding:15,
    borderRadius: theme.radius.xxl,
    borderCurve:'continuous'
  },
  nameTitle:{
    flex:1,
    gap:2
  },
  text:{
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  }
})