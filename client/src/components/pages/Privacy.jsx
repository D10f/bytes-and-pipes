import { motion } from 'framer-motion';

const pageVariant = {
  initial: {
    x: '-100vw',
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: '100vw',
    opacity: 0
  }
};

const Privacy = () => (
  <motion.article
    className="document"
    variants={pageVariant}
    initial="initial"
    animate="visible"
    exit="exit"
  >
    <h2>What information do you collect</h2>
    <p>When you visit our website a log entry is produced in our servers. This information contains a timestamp of your visit, IP address and user-agent string which may contain further details such as web browser and operating system.</p>
    <p>If any errors are produced while using our service they may be send back to create a report of the issue, using information about your web browser and operating system. This is done in order to improve the quality of the service.</p>
    <p>We don't use any website analytics and log no information related to how you use or interact with our website. We do not use any cookies, either.</p>

    <h2>How long do you keep information in the server</h2>
    <p>Uploaded files are automatically deleted after they're downloaded or after 24 hours, whichever happens first.</p>
    <p>Any logs generated as a result of your visit or errors produced while using our service are deleted after 30 days.</p>
    <p>No data of any kind is shared with any third parties.</p>

    <h2>Where are your servers located</h2>
    <p>Servers are located in Amsterdam, The Netherlands.</p>
  </motion.article>
);

export default Privacy;
