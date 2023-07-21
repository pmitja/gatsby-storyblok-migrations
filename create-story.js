import StoryblokClient from "storyblok-js-client";
import axios from "axios";
import pkg from "storyblok-markdown-richtext";
const { markdownToRichtext } = pkg;
import TurndownService from "turndown";

const turndownService = new TurndownService();
const richtextObject = markdownToRichtext(
  turndownService.turndown(
    '<p>Culture was one of the sectors most heavily impacted during the early stages of the Covid pandemic – unsurprisingly so, since cultural institutions rely on large numbers of visitors in closed-off indoor spaces, often in close proximity to one another.</p>\n\n<p>Consequently, digital transformation became a must for cultural institutions; however, in order to attract visitors in this new world in the same way as before, they now need more than just a basic website – they need a platform that can provide an equally appealing experience and is consistent with the institution’s overall digital presence.</p>\n\n<p>In this article, we’ll break down the key features that cultural institutions should prioritize for their digital platforms, focusing on <em>why</em> they are so important in the new digital reality, i.e. how they benefit the institution and/or the visitor.</p>\n\n<p>&nbsp;</p>\n\n<h2>Overall user experience</h2>\n\n<p>Without a good user experience, you may as well not invest in any of the other features at all – yes, it is that important, especially now in the digital age where an organization’s digital presence is inseparable from its overall impression and reputation.&nbsp;</p>\n\n<p>Great website UX is just generally a key element of any kind of digital experience, and it’s now something that’s expected rather than desired. In contrast, poor user experience produces a negative impression, and a sense of misalignment with the organization’s mission.</p>\n\n<p>An additional consideration for cultural institutions is the <strong>global nature of their visitors</strong>, with the most popular institutions attracting tourists from all over the world. This requires features such as strong multilingual support (including <a href="/blog/lets-talk-about-localization" title="Agiledrop blog: Let\'s talk about localization">localization</a> if and where relevant) and a special focus on accessibility due to the high degree of diversity among their visitors.</p>\n\n<p>&nbsp;</p>\n\n<h2>Ticket purchasing</h2>\n\n<p>As the world moved more and more online during Covid, the ability to purchase tickets online has gone from a nice-to-have to a must-have, even for cases and industries where this previously hadn’t been the norm, namely, cultural institutions.</p>\n\n<p>In order not to lose visitors due to complicated processes and/or inaccessible ticketing information, cultural institutions now need to offer <strong>frictionless e-commerce capabilities</strong> as part of their digital experiences, either as their own feature or as a seamless integration with a different ecommerce platform.</p>\n\n<p>&nbsp;</p>\n\n<h2>Omnichannel experiences</h2>\n\n<p>Due to the multitude of devices and channels people frequent today, modern digital infrastructure needs to support a good experience on all of these differing channels, with a special emphasis on the <strong>mobile experience</strong>.</p>\n\n<p><a href="/blog/digital-strategy-omnichannel-digital-experiences" title="Agiledrop blog: Digital strategy for omnichannel digital experiences">Omnichannel experiences</a> are particularly important for cultural institutions as popular tourist destinations; people tend not to travel with their laptops, but with tablets and smartphones, which they use both to access information and buy tickets, as well as during an actual visit to a museum or gallery.</p>\n\n<p>As such, patrons of cultural institutions expect – if not demand – their experiences to be <strong>connected</strong> and <strong>consistent</strong> as they move through these different channels, and those creating digital experiences for these institutions have to guarantee this consistency through tools such as responsive design and a streamlined decoupled architecture.</p>\n\n<p>&nbsp;</p>\n\n<h2>Latest technology innovations</h2>\n\n<p>In the context of connected experiences, <a href="/podcast/sylvain-moreau-digital-transformation-cultural-institutions" title="Agiledrop podcast: Sylvain Moreau - Digital transformation in cultural institutions">innovative use of novel technologies such as augmented &amp; virtual reality and 3D printing</a> can both <strong>enhance the experience of on-site visitors</strong> as well as <strong>provide comparable experiences in cases of people who want to visit the institution remotely</strong> if they live far away and might not have the means to travel and/or visit a desired gallery or museum in person.</p>\n\n<p>&nbsp;</p>\n\n<h2>Architecture and performance</h2>\n\n<p>Another key element of a cultural institution’s digital platform is a <strong>robust and performant back-end infrastructure</strong> to cater to their and their visitors’ unique needs, including the aforementioned omnichannel experiences and AR/VR support.</p>\n\n<p>Even more importantly, however, detailed digitized versions of artworks have become an expected feature of a gallery or museum website, but this requires a capable and user-friendly content repository which can handle large volumes of large digital assets. This is exactly why the <a href="/drupal" title="Agiledrop: Drupal development">Drupal</a> CMS is a popular choice as a content management platform for many cultural institutions.</p>\n\n<p>&nbsp;</p>\n\n<h2>Marketing and engagement</h2>\n\n<p>In today’s multichannel digital reality, cultural institutions too need to be present and active wherever their potential visitors are – and in the case of the most popular museums and galleries, such as for example the Louvre in Paris, these potential visitors are literally billions of people from all over the world.</p>\n\n<p>In addition to <strong>appealing, patron-oriented website content</strong> which entices a visit, a <strong>strong social media presence</strong> should also be an indispensable marketing tool for cultural institutions, just like for popular consumer brands.&nbsp;</p>\n\n<p>This is especially for the just mentioned highly popular galleries and museums which often have a strong and long-lasting reputation to maintain. For instance, the British Museum is a great example of a cultural institution that posts <a href="https://twitter.com/britishmuseum/status/1653331754676109314" target="_blank" title="British Museum on Twitter: Behold the mouse!">engaging social media content</a> which <strong>taps into currently popular cultural trends and forms connections with their audiences</strong>.</p>\n\n<p>&nbsp;</p>\n\n<article data-align="center"><img src="/sites/default/files/styles/medium_800/public/2023-05/screenshot_2023-05-26_at_08.46.08.png?itok=4P0Fdb_7" width="800" height="776" alt="aerhbr" loading="lazy"></article><p class="text-align-center"><em>Tweet by the British Museum showing a badge from medieval times with a cat carrying a mouse in its mouth, pointing out how cats have been bringing their owners such “presents” for centuries</em></p>\n\n<p>&nbsp;</p>\n\n<h2>Conclusion</h2>\n\n<p>As the world opens up again, cultural institutions need to ensure their digital experiences are up to par with the physical experiences they offer to their visitors. The tips from this article will help you uncover the key aspects to prioritize, as well as provide ideas on future optimizations to your patrons’ experience.</p>\n\n<p><em>Need help in creating, refreshing, optimizing or maintaining your museum’s or gallery’s website? Check out <a href="/get-developers" title="Agiledrop: Get developers">what it’s like working with our team</a>, or <a href="mailto:info@agiledrop.com">reach out directly</a> for any specific problems we can help you solve.</em></p>'
  )
);

const imgSrc = (obj) => {
  let srcImg;
  obj.content.map((entry) => {
    if (entry.content[0].type === "image") {
      let src = entry.content[0].attrs.src;
      const actualName = src.split("/").find((el) => el.includes(".png")).split("?")[0];
      const ext = actualName.split(".").pop();
      const correct = actualName.split(".png")[0].replaceAll(".", "-");
      srcImg = correct + "." + ext;
      console.log(srcImg);
    }
  })
  return srcImg;
};

const imgName = imgSrc(richtextObject);
console.log(imgName);


// Initialize the client with the oauth token
const Storyblok = new StoryblokClient({
  oauthToken: "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd",
});


const image = Storyblok.get('spaces/230321/assets/', {})
.then(response => {
  response.data.assets.map((el) => {
    if (el.filename.includes(imgName)) {
      return el;
    }
  })
}).catch(error => { 
  console.log(error)
})

console.log(image);


// Storyblok.post("spaces/230321/stories/", {
//   story: {
//     name: "Article 8",
//     slug: "article-8",
//     content: {
//       component: "Article",
//       article_title: "Article 8",
//       subtitle: "this is subtitle of article 8",
//       content: richtextObject,
//       image: {
//         filename:
//           "https://a.storyblok.com/f/230321/400x500/9da7b82b7a/cultural_institutions_dx_cover.png",
//       },
//     },
//     parent_id: "309719183",
//   },
// });
K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd