@MWS @All
Feature: MWS

  Scenario Outline: MWS screenshot "<URL>" UI comparison
    Given a User is browsing NS&I marketing website
    When the User navigated to the "<URL>" MWS page
    Then the "MWS" page is displayed properly

    Examples:
      | URL                  |
      |                      |
      | /5-tips-save-smarter |
      | /accessibility       |
      | /big-life-moments    |
#      | /blog                                                                                                         |
#      | /blog/about-us                                                                                                |
#      | /blog/about-us/page/2                                                                                         |
#      | /blog/ns-and-you                                                                                              |
#      | /blog/ns-and-you/page/2                                                                                       |
#      | /blog/ns-and-you/page/3                                                                                       |
#      | /blog/page/2                                                                                                  |
#      | /blog/page/3                                                                                                  |
#      | /blog/page/4                                                                                                  |
#      | /blog/page/5                                                                                                  |
#      | /blog/page/6                                                                                                  |
#      | /blog/page/7                                                                                                  |
#      | /blog/page/8                                                                                                  |
#      | /blog/page/9                                                                                                  |
#      | /blog/security                                                                                                |
#      | /blog/security/page/2                                                                                         |
#      | /blog/security/page/3                                                                                         |
#      | /blog/stories                                                                                                 |
#      | /blog/technology                                                                                              |
#      | /british-savings-bonds                                                                                        |
#      | /common-reporting-standard                                                                                    |
#      | /contact-us                                                                                                   |
#      | /cyfraddau-llog                                                                                               |
#      | /cysylltwch-ni                                                                                                |
#      | /downloads-and-forms                                                                                          |
#      | /easy-access-saving                                                                                           |
#      | /ein-cynilion-buddsoddiadau                                                                                   |
#      | /for-young-savers                                                                                             |
#      | /get-to-know-us/about-premium-bonds                                                                           |
#      | /get-to-know-us/about-us/30-years-of-premium-bonds-millionaires                                               |
#      | /get-to-know-us/managing-maturities                                                                           |
#      | /get-to-know-us/monthly-prize-allocation                                                                      |
#      | /get-to-know-us/nsandyou/gift                                                                                 |
#      | /get-to-know-us/nsandyou/how-to-save-while-you-sleep                                                          |
#      | /get-to-know-us/nsandyou/paper-free                                                                           |
#      | /get-to-know-us/people-like-you/be-my-own-boss                                                                |
#      | /get-to-know-us/people-like-you/carry-on-without-worry                                                        |
#      | /get-to-know-us/people-like-you/help-family-savings                                                           |
#      | /get-to-know-us/prize-winner-locations                                                                        |
#      | /get-to-know-us/quicker-prizes                                                                                |
#      | /get-to-know-us/security/email-scams                                                                          |
#      | /get-to-know-us/security/extra-security                                                                       |
#      | /get-to-know-us/security/our-online-security-promise                                                          |
#      | /get-to-know-us/security/pharming                                                                             |
#      | /get-to-know-us/security/phone-call-scams                                                                     |
#      | /get-to-know-us/security/protect-your-money                                                                   |
#      | /get-to-know-us/security/text-message-scams                                                                   |
#      | /get-to-know-us/superpower                                                                                    |
#      | /get-to-know-us/technology/use-mobile-apps                                                                    |
#      | /get-to-know-us/technology/voice                                                                              |
#      | /get-to-know-us/why-nsandi                                                                                    |
#      | /get-to-know-us/winning-bonds-downloads                                                                       |
#      | /green-saving                                                                                                 |
#      | /guaranteed-returns                                                                                           |
#      | /hafan                                                                                                        |
#      | /help                                                                                                         |
#      | /help/join-nsandi                                                                                             |
#      | /help/join-nsandi/create-password                                                                             |
#      | /help/join-nsandi/evidence-of-identity                                                                        |
#      | /help/join-nsandi/evidence-of-identity/                                                                       |
#      | /help/join-nsandi/using-nsandi-outside-uk                                                                     |
#      | /help/join-nsandi/your-nsandi-number                                                                          |
#      | /help/leaving-nsandi/closing-account                                                                          |
#      | /help/lost-touch-with-nsandi                                                                                  |
#      | /help/lost-touch-with-nsandi/check-unclaimed-prizes                                                           |
#      | /help/lost-touch-with-nsandi/get-back-to-premium-bonds                                                        |
#      | /help/lost-touch-with-nsandi/replace-missing-records                                                          |
#      | /help/lost-touch-with-nsandi/track-lost-investments                                                           |
#      | /help/manage-money-for-others                                                                                 |
#      | /help/manage-money-for-others/customers-who-have-died                                                         |
#      | /help/manage-money-for-others/inherited-savings                                                               |
#      | /help/manage-money-for-others/looking-after-childs-savings                                                    |
#      | /help/manage-money-for-others/manage-saving-for-adult                                                         |
#      | /help/manage-your-details                                                                                     |
#      | /help/manage-your-details/accessing-your-online-account                                                       |
#      | /help/manage-your-details/change-communication-preferences                                                    |
#      | /help/manage-your-details/change-personal-details                                                             |
#      | /help/manage-your-details/change-security-details                                                             |
#      | /help/manage-your-details/how-to-receive-money-from-nsandi                                                    |
#      | /help/manage-your-savings                                                                                     |
#      | /help/manage-your-savings/check-received-payment                                                              |
#      | /help/manage-your-savings/check-the-value-of-investments                                                      |
#      | /help/manage-your-savings/getting-extra-support                                                               |
#      | /help/manage-your-savings/keep-account-safe                                                                   |
#      | /help/manage-your-savings/make-withdrawal-from-savings                                                        |
#      | /help/manage-your-savings/manage-savings-online                                                               |
#      | /help/manage-your-savings/maturing-investments                                                                |
#      | /help/manage-your-savings/maturing-investments/closed-accounts                                                |
#      | /help/manage-your-savings/maturing-investments/fixed-rate-savings-certificates                                |
#      | /help/manage-your-savings/maturing-investments/green-savings-bonds                                            |
#      | /help/manage-your-savings/maturing-investments/guaranteed-growth-bonds                                        |
#      | /help/manage-your-savings/maturing-investments/guaranteed-income-bonds                                        |
#      | /help/manage-your-savings/maturing-investments/index-linked-savings-certificates                              |
#      | /help/manage-your-savings/maturing-investments/index-linked-savings-certificates/index-linked-extension-terms |
#      | /help/manage-your-savings/merging-your-accounts                                                               |
#      | /help/manage-your-savings/premium-bonds-prizes                                                                |
#      | /help/manage-your-savings/switching                                                                           |
#      | /help/manage-your-savings/take-ownership-of-savings                                                           |
#      | /help/manage-your-savings/tax-on-savings                                                                      |
#      | /help/manage-your-savings/top-up-savings                                                                      |
#      | /help/ways-to-pay                                                                                             |
##      | /help/ways-to-pay/pay-bank-account                                                                            |
#      | /historical-interest-rates                                                                                    |
#      | /ilsc-calculator                                                                                              |
#      | /interest-rates                                                                                               |
#      | /isa                                                                                                          |
#      | /isa-changes                                                                                                  |
#      | /joint-saving-account                                                                                         |
#      | /online-registration                                                                                          |
#      | /pay-bank-account-privacy-notice                                                                              |
#      | /privacy-notice                                                                                               |
#      | /prize-checker                                                                                                |
#      | /prize-checker/winners                                                                                        |
#      | /products                                                                                                     |
#      | /products/direct-isa                                                                                          |
#      | /products/direct-saver                                                                                        |
#      | /products/green-savings-bonds                                                                                 |
#      | /products/guaranteed-growth-bonds                                                                             |
#      | /products/guaranteed-income-bonds                                                                             |
#      | /products/income-bonds                                                                                        |
#      | /products/junior-isa                                                                                          |
#      | /products/premium-bonds                                                                                       |
#      | /rainy-day-savings                                                                                            |
#      | /saving-for-children                                                                                          |
#      | /saving-goals                                                                                                 |
#      | /site-conditions-and-legal                                                                                    |
#      | /tax-free-saving                                                                                              |
#      | /two-factor-authentication-help                                                                               |
#      | /voice-apps-terms-of-use                                                                                      |
