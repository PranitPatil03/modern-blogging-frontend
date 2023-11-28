
import Code from "@editorjs/code"
import Embed from "@editorjs/embed"
import Header from "@editorjs/header"
import Image from "@editorjs/image"
import List from "@editorjs/list"
import Quote from "@editorjs/quote"
import InlineCode from "@editorjs/inline-code"
import uploadImg from "../common/AWS"

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e)
    } catch (err) {
      reject(err)
    }
  })

  return link.then(url => {
    return {
      success: 1,
      file: { url }
    }
  })
}

const uploadImageByFile = (e) => {
  return uploadImg(e).then(url => {
    if (url) {
      return {
        success: 1,
        file: { url }
      }
    }
  })
}

export const tools = {
  code: Code,
  embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: "Type Something ....",
      levels: [2, 3],
      defaultLevels: 2
    }
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile
      }
    }
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  quote: {
    class: Quote,
    inlineToolbar: true
  },
  inlineCode: InlineCode
}