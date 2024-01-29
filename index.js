const puppeteer = require('puppeteer');

async function searchHospitalLinks(hospitalNames) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const links = {};

  for (const hospitalName of hospitalNames) {
    const googleSearchQuery = `site:linkedin.com OR site:hospital-website.com "hospital" "${hospitalName} Springfield MA"`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(googleSearchQuery)}`;

    try {
      await page.goto(googleSearchUrl, { waitUntil: 'domcontentloaded' });

      const isCaptchaPage = await page.evaluate(() => {
        const captchaForm = document.querySelector('.g-recaptcha');
        return !!captchaForm;
      });

      if (isCaptchaPage) {
        console.log(`CAPTCHA encountered for ${hospitalName}. Please complete CAPTCHA manually.`);

        await new Promise(resolve => {
          console.log("Bot error! Fix the captcha and press enters");

          process.stdin.once('data', () => {
            resolve();
          });
        });

      }


      const resultLinks = await page.evaluate(() => {
        const links = [];
        const searchResults = document.querySelectorAll('.g');
        searchResults.forEach((result) => {
          const link = result.querySelector('a');
          if (link) {
            if (link.href.startsWith('https://www.linkedin.com/') || link.href.includes('hospital-website.com')) {
              links.push(link.href);
            }
          }
        });
        return links;
      });

      links[hospitalName] = resultLinks.length > 0 ? resultLinks : null;
    } catch (error) {
      console.error(`Error searching for ${hospitalName}: ${error.message}`);
      links[hospitalName] = null;
    }


    await new Promise(resolve => setTimeout(resolve, 1000)); 
  }

  await browser.close();

  return links;
}

const hospitalNames = [
    "Nashaway Dental Group PC",
    "John G Stagias MD",
    "Vicki Heller, MD",
    "Mark C. Nitzberg, PC",
    "Cape Cod Medical Enterprises Inc",
    "William A Allen Co Inc",
    "Hillcrest Extended Care Services, Inc",
    "Medford Optical Shop, Inc",
    "Truesdale Medical Partners, LLC",
    "Baystate Wing Hospital Corporation",
    "City of Springfield",
    "Theodore R. Nelson, DDS, PC",
    "David W. Lhowe, M.D., PC",
    "Neurology Consultants of Cape Cod PC",
    "Jonathan D Krant MD MPHPC",
    "Foot Health Center of Merrimack Valley PC",
    "Tananbaum & Zibbell, PC",
    "Middlesex Gastroenterology, PC",
    "Advanced Treatment Center Inc",
    "Michael D. McKenzie, M.D., PC",
    "Southern Berkshire Regional School District",
    "George J Ducach DPM PC",
    "Plymouth Bridgewater Eye Care",
    "Harborlights Nursing, LLC",
    "CVS Pharmacy Inc",
    "Ultrasound Images, Inc",
    "Clifton Geriatric Center",
    "Harrington Memorial Hospital",
    "Agawam Nursing LLC",
    "Anna Jaques Hospital",
    "Northeast Cardiology, Inc",
    "American Vision Associates, LLC",
    "Berkshire Eye Center PC",
    "Advanced Medical Group",
    "Drs. Leveton & Leiter DDS PC",
    "Ehrlich Dental Associates Inc",
    "Walgreen Co",
    "Dedham Medical Assoc Inc",
    "New England Urology Associates, PC",
    "Cardiology Thoracic Associates Inc",
    "Adult Medicine Physicians, LLC",
    "Smile Design Boston",
    "Craig Jones, PsyD, LLC",
    "Riverside Eye Care PC",
    "Sage Psychotherapy",
    "Masi Dental Group PC",
    "Two Roads Wellness Associates, LLC",
    "Rebecca Horne Pediatrics, LLC",
    "Walgreen Co",
    "William H. Burghardt DDS LLC",
    "Walgreen Co",
    "Maximize Your Mobility LLC",
    "New England Aftercare Ministries, Inc",
    "Caring Health Center, Inc",
    "Mustali M Dohadwala MD LLC",
    "Golden Boxer LLC",
    "Performance Rehabilitation of Western New England LLC",
    "Serenity Coaching and Counseling, LLC",
    "Tresor Home Care LLC",
    "Orthopedic and Sports Physical Therapy Associates"
  ];

searchHospitalLinks(hospitalNames)
  .then((hospitalLinks) => {
    console.log('LinkedIn and Website links for hospitals:');
    console.log(hospitalLinks);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
