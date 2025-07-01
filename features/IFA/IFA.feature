@IFA @All
Feature: IFA

  Scenario Outline: IFA screenshot "<URL>" UI comparison
    Given a customer is browsing NS&I adviser website
    When the User navigated to the "<URL>" IFA page
    Then the "IFA" page is displayed properly

    Examples:
      | URL         |
      | /why-nsandi |

