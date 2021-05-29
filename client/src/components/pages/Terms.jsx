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

const Terms = () => (
  <motion.article
    className="document"
    variants={pageVariant}
    initial="initial"
    animate="visible"
    exit="exit"
  >
    <p>This document was last updated on May 27, 2021</p>

    <h2>Terms of use</h2>
    <p>These terms and conditions ("Agreement") set forth the general terms and conditions of your use of the <a target="_blank" href="https://bytesandpipes.com">Bytes And Pipes</a> website ("Website" or "Service") and any of its related products and services (collectively, "Services"). This Agreement is between you ("User", "you" or "your") and this Website operator ("Operator", "we", "us" or "our"). By accessing and using the Website and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. If you are entering into this Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Agreement, in which case the terms "User", "you" or "your" shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this Agreement, you must not accept this Agreement and may not access and use the Website and Services. You acknowledge that this Agreement is a contract between you and the Operator, even though it is electronic and is not physically signed by you, and it governs your use of the Website and Services.</p>

    <h2>Content ownership</h2>
    <p>We do not own any data, information or material (collectively, "Content") that you submit on the Website in the course of using the Service. You shall have sole responsibility for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all submitted Content. Without limiting any of those representations or warranties, we have the right, though not the obligation, to, in our own sole discretion, refuse or remove any Content that, in our reasonable opinion, violates any of our policies or is in any way harmful or objectionable.</p>

    <h2>Content liability</h2>
    <p>We are not responsible for the Content residing on the Website. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.</p>

    <h2>Disclaimer</h2>
    <p>Although the Website and Services may link to other resources (such as websites, mobile applications, etc.), we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked resource, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their resources. We do not assume any responsibility or liability for the actions, products, services, and content of any other third parties. You should carefully review the legal statements and other conditions of use of any resource which you access through a link on the Website and Services.</p>

    <h2>Member conduct</h2>
    <p>In addition to other terms as set forth in the Agreement, you are prohibited from using the Website and Services or Content:</p>
    <ul>
      <li>for any unlawful, immoral or obscene purpose.</li>
      <li>to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Website and Services, third party products and services, or the Internet.</li>
      <li>to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances.</li>
      <li>to interfere with or circumvent the security features of the Website and Services, third party products and services, or the Internet.</li>
      <li>to infringe upon or violate intellectual property rights of others.</li>
    </ul>

    <h2>Termination clause</h2>
    <p>We reserve the right to terminate your use of the Website and Services for violating any of the prohibited uses.</p>

    <h2>Contact us</h2>
    <p>If you would like to contact us to understand more about this Agreement or wish to contact us concerning any matter relating to it, you may send an email to <a href="mailto:devsojourn@pm.me">devsojourn@pm.me</a>.</p>
  </motion.article>
);

export default Terms;
