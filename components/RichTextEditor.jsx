import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
  editorRef,
  onChange
}) => {
  return (
    <View style={{minHeight:285}}>
       <RichToolbar 
       actions={[
        actions.setBold,
        actions.setItalic,
        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.insertImage,
        actions.line,
        actions.alignCenter,
        actions.alignRight,
        actions.alignLeft,
        actions.code,
        actions.blockquote,
        actions.removeFormat,
        actions.heading1,
        actions.heading4
      ]}

      //custom headings
      iconMap={{
        [actions.heading1]:({tintColor})=><Text style={{color:tintColor}}>H1</Text>,
        [actions.heading4]:({tintColor})=><Text style={{color:tintColor}}>H4</Text>
      }}
       style={styles.richBar}
       flatContainerStyle={styles.flatStyle}
       editor={editorRef}
       disabled={false}
       selectedIconTint={theme.colors.primaryDark}

       />
       <RichEditor 
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.containerStyle}
        placeholder={"What's on your mind?"}
       />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
richBar:{
  borderTopRightRadius:theme.radius.xl,
  borderTopLeftRadius:theme.radius.xl,
  backgroundColor:theme.colors.gray
},
rich:{
  minHeight: 240,
  flex: 1,
  borderWidth: 1.5,
  borderTopWidth: 0,
  borderBottomLeftRadius: theme.radius.xl,
  borderBottomRightRadius: theme.radius.xl,
  borderColor:theme.colors.gray,
  padding:5
},
contentStyle:{
  color:theme.colors.gray
},
flatStyle:{
  paddingHorizontal:8,
  gap:3
}

})