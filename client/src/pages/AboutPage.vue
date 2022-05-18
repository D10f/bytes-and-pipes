<template>
  <main>
    <h2>What is it and how it works</h2>
    <p>
      Bytes And Pipes is an open-source web application to share large files
      easily and privately using only your internet browser.
    </p>
    <p>
      You can upload any type of file and a download link will be provided to
      you. Share this link with whoever you want with the assurance that no one
      but you can see it's contents.
    </p>

    <h2>Restrictions uploading files</h2>
    <p>
      You can upload files of up to 1Gb. Files downloaded once will be deleted,
      but you can upload the same file multiple times and share each link
      individually.
    </p>
    <p>
      Please understand that these restrictions may change in the future without
      prior notice, in order to prevent spam, abuse and to keep costs of running
      servers under control.
    </p>

    <h2 id="encryption-strategy">Encryption strategy</h2>
    <img
      loading="lazy"
      alt="Diagram showing the difference in encryption strategies"
    />
    <p>
      You will be prompted to enter a password before uploading any file. Your
      file will be encrypted regardless whether you enter a password or not, it
      will just use a different process that will ultimately produce a different
      download link. Choose whatever method you feel most comfortable with.
    </p>
    <p>
      Enter a password if you need to share the download link over public
      channels such public chatrooms or online forums. Only with the correct
      password you will be able to download the file so your download link does
      not have to be kept secret. However you will have to figure out a way to
      share the password with the other party, maybe arrange it in advance or
      use a secure communication channel.
    </p>
    <p>
      Make sure to choose a strong password to avoid brute-force attacks that
      may guess it.
    </p>
    <p>
      Alternatively you can choose to leave the password field blank. In that
      case your file will be encrypted with a randomly generated encryption key.
      This is convenient because the link itself holds the encryption key so no
      one has to remember any passwords. Use this method if you plan to share
      the link over channels that you already consider secure.
    </p>

    <h2>Tech Stack</h2>
    <p>
      Please visit the
      <a href="https://github.com/D10f/bytes-and-pipes" target="_blank"
        >GitHub page</a
      >
      for a more detailed explanation on the technical aspects of Bytes and
      Pipes.
    </p>
  </main>
</template>

<script>
export default {
  name: 'AboutPage',
};
</script>

<style scoped>
main {
  max-width: 80ch;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}
h2 {
  font-size: 2rem;
  font-family: 'Ubuntu';
  margin: 2rem 0 1rem 0;
}
p {
  margin: 1rem 0;
}
</style>
