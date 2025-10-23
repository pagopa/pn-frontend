# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.19.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.19.0-RC.1...v2.19.0-RC.2) (2025-10-23)


### Bug Fixes

* **pn-16309:** Fix notification search timeout ([#1644](https://github.com/pagopa/pn-frontend/issues/1644)) ([cb80b84](https://github.com/pagopa/pn-frontend/commit/cb80b84bb2f05b7e1a52975acb410042d821397d))





# [2.19.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.19.0-RC.0...v2.19.0-RC.1) (2025-10-22)


### Bug Fixes

* **PN-15847:** adjust foreign state max length validation ([#1666](https://github.com/pagopa/pn-frontend/issues/1666)) ([f5ca9d5](https://github.com/pagopa/pn-frontend/commit/f5ca9d5838b5bb22f8548f285c882a9da93dfe8c))


### Features

* **pn-16604:** update copy PF and PG ([#1663](https://github.com/pagopa/pn-frontend/issues/1663)) ([0711433](https://github.com/pagopa/pn-frontend/commit/0711433607b825b180adf7bb0f931df3058b1d22))





# [2.19.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.18.0...v2.19.0-RC.0) (2025-10-13)


### Bug Fixes

* **PN-15803:** toggle edit mode when editing a special contact ([#1630](https://github.com/pagopa/pn-frontend/issues/1630)) ([e5e4d34](https://github.com/pagopa/pn-frontend/commit/e5e4d34389a31cdbcd80ad79619274453b41c55b))
* **PN-15847, PN-15848:** add max length validation to house number and foreignState fields ([#1629](https://github.com/pagopa/pn-frontend/issues/1629)) ([d83ab17](https://github.com/pagopa/pn-frontend/commit/d83ab172f332503845340eab12a314064b6a4ab5))
* **PN-16064:** display confirmation modal when editing a phone number from the SERCQ activation wizard ([#1626](https://github.com/pagopa/pn-frontend/issues/1626)) ([2e83103](https://github.com/pagopa/pn-frontend/commit/2e83103169bb7149fdf4ed484fc1b9884a923757))
* **PN-16113:** fix menu link in ToS and Policy page ([#1638](https://github.com/pagopa/pn-frontend/issues/1638)) ([26d91b6](https://github.com/pagopa/pn-frontend/commit/26d91b6fa10362346625451bbcb61bdfbde63f06))
* **PN-16180:** Remove amount and paymentExpirationDate on NotificationDetail (PF, PG, PA) ([#1639](https://github.com/pagopa/pn-frontend/issues/1639)) ([fc620c2](https://github.com/pagopa/pn-frontend/commit/fc620c2bb919e2c5eb26caa7165bd1168c56b98c))
* **PN-16259:** pass translated label in Header component ([#1635](https://github.com/pagopa/pn-frontend/issues/1635)) ([e056736](https://github.com/pagopa/pn-frontend/commit/e0567368b4ba95ec11ef499f68c70d67dbee3030))
* **PN-16309:** Fix notification search timeout ([#1661](https://github.com/pagopa/pn-frontend/issues/1661)) ([2833eb2](https://github.com/pagopa/pn-frontend/commit/2833eb2f7426c01e0f7d7fedf0cddd5c0fb0bd4a))
* **PN-16362:** add courtesy contacts to Mixpanel event when adding special contact ([#1643](https://github.com/pagopa/pn-frontend/issues/1643)) ([af6a3c7](https://github.com/pagopa/pn-frontend/commit/af6a3c73ff270a617696c680d784631e6c62d9e8))
* **PN-16387:** properly handle email deletion when SERCQ is enabled ([#1647](https://github.com/pagopa/pn-frontend/issues/1647)) ([4aa7bc7](https://github.com/pagopa/pn-frontend/commit/4aa7bc70cdae6c6f88614e8883a2915c758b1541))
* **PN-16621:** avoid call api logout if token is expired on session guard ([#1649](https://github.com/pagopa/pn-frontend/issues/1649)) ([6ed1c9d](https://github.com/pagopa/pn-frontend/commit/6ed1c9d059c2862b4104cde813d1787c2c0e5e3c))
* **PN-16660:** remove useless toast from SERCQ activation ([#1659](https://github.com/pagopa/pn-frontend/issues/1659)) ([822eb98](https://github.com/pagopa/pn-frontend/commit/822eb98343cc9087d9efc6b04007553ca71ed966))


### Features

* **PN-16215:** refactor guards in PA ([244e9f1](https://github.com/pagopa/pn-frontend/commit/244e9f1195ba14e649bc31ead8bb4a17a8ac5330))
* **PN-16216:** refactor guards in PG ([#1636](https://github.com/pagopa/pn-frontend/issues/1636)) ([96b2190](https://github.com/pagopa/pn-frontend/commit/96b21901c35b5b305f6ea6aa8a2af91e3e635c2a))
* **PN-16381:** Make email required for SERCQ activation/transfer (PF and PG) ([#1645](https://github.com/pagopa/pn-frontend/issues/1645)) ([9892d9f](https://github.com/pagopa/pn-frontend/commit/9892d9f21b66a2a5591e80ce99967942401e0c00))
* **PN-16382:** make email required in digital domicile customization ([#1655](https://github.com/pagopa/pn-frontend/issues/1655)) ([deb7b4e](https://github.com/pagopa/pn-frontend/commit/deb7b4ecf38607915118977a6a2d15d8797fac71))
* **PN-16388:** update SERCQ/PEC disable modal ([#1656](https://github.com/pagopa/pn-frontend/issues/1656)) ([aa873e3](https://github.com/pagopa/pn-frontend/commit/aa873e3b2c5e88f63e00a3d0063544cc91835ae5))
* **PN-16659:** update content of thank you page during PEC activation ([#1654](https://github.com/pagopa/pn-frontend/issues/1654)) ([69e6bea](https://github.com/pagopa/pn-frontend/commit/69e6beabd74ea732c48d3d5ebd1b47bff84f285f))
* **PN-16747/PN-16748:** change SMS and IO removal modals when digital domicile (SERCQ or PEC) is active ([#1653](https://github.com/pagopa/pn-frontend/issues/1653)) ([d8a91a7](https://github.com/pagopa/pn-frontend/commit/d8a91a7f1da24299cbdc5bfe1c31c6de371a17a2))
* **PN-16758:** update deletion modal for per-sender SERCQ ([#1658](https://github.com/pagopa/pn-frontend/issues/1658)) ([15b4faf](https://github.com/pagopa/pn-frontend/commit/15b4faf5b4635c5f90b6f0fdb7a560000942e51b))
* **PN-16773:** update api call order in removeSercqAndEmail action ([#1657](https://github.com/pagopa/pn-frontend/issues/1657)) ([7e02f7f](https://github.com/pagopa/pn-frontend/commit/7e02f7f2a2a03f6f402010b5c0286c7a6bd281e4))
* **PN-16826:** remove email and SMS informative dialog during SERCQ activation/transfer wizard ([#1660](https://github.com/pagopa/pn-frontend/issues/1660)) ([fe4ce70](https://github.com/pagopa/pn-frontend/commit/fe4ce70f2982359a3a598aa3ebf6e07bb8961ff6))





# [2.18.0](https://github.com/pagopa/pn-frontend/compare/v2.18.0-RC.4...v2.18.0) (2025-09-17)

**Note:** Version bump only for package pn-frontend






# [2.18.0-RC.4](https://github.com/pagopa/pn-frontend/compare/v2.18.0-RC.3...v2.18.0-RC.4) (2025-09-15)


### Bug Fixes

* **PN-16263:** fix CodeInput 'jumping caret bug' on Android ([#1642](https://github.com/pagopa/pn-frontend/issues/1642)) ([9a6e434](https://github.com/pagopa/pn-frontend/commit/9a6e4345909df4f8d6c3e1570a8e86d0e4b69d99))






# [2.18.0-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.18.0-RC.2...v2.18.0-RC.3) (2025-09-09)


### Bug Fixes

* **PN-16269:** show OTP error when modal is open and reset state on close on AcceptDelegationModal (PG) ([#1637](https://github.com/pagopa/pn-frontend/issues/1637)) ([7928516](https://github.com/pagopa/pn-frontend/commit/7928516882f1bf9c9353cbb45c10e4c570ead4a0))






# [2.18.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.18.0-RC.1...v2.18.0-RC.2) (2025-09-05)


### Bug Fixes

* **PN-16258:** move accessibilityLink in single configuration file ([#1634](https://github.com/pagopa/pn-frontend/issues/1634)) ([3e0f832](https://github.com/pagopa/pn-frontend/commit/3e0f832d0944658b616c9164222692b75122dab1))





# [2.18.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.18.0-RC.0...v2.18.0-RC.1) (2025-09-04)

**Note:** Version bump only for package pn-frontend





# [2.18.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.17.1...v2.18.0-RC.0) (2025-09-03)


### Bug Fixes

* **PN-13213:** add hidden label to payment Radio button to improve component a11y ([#1606](https://github.com/pagopa/pn-frontend/issues/1606)) ([#1624](https://github.com/pagopa/pn-frontend/issues/1624)) ([ee72d57](https://github.com/pagopa/pn-frontend/commit/ee72d57f33819d4d6c527c7c22f544a4741b9928))
* **pn-14226:** Special contacts banners when pec is validating or user already set another contact for the same pa ([#1601](https://github.com/pagopa/pn-frontend/issues/1601)) ([22b97fa](https://github.com/pagopa/pn-frontend/commit/22b97face0d64b27d05257cca2bad6588d217725))
* **PN-14794:** do not render component if inactivity handler is disabled ([#1627](https://github.com/pagopa/pn-frontend/issues/1627)) ([2bef451](https://github.com/pagopa/pn-frontend/commit/2bef451d80f5dd6bbe0217bb377536a4f3b40043))
* **pn-14794:** handle user inactivity ([#1620](https://github.com/pagopa/pn-frontend/issues/1620)) ([ef957f1](https://github.com/pagopa/pn-frontend/commit/ef957f1a5fac27739c6b358c408e3d85ed485140))
* **PN-15517:** use actual expiry token date from api response ([#1618](https://github.com/pagopa/pn-frontend/issues/1618)) ([912c1e4](https://github.com/pagopa/pn-frontend/commit/912c1e4c883a0e59bd57b93c40b7bf1e35b65866))


### Features

* **PN-15517:** refactor SessionGuard in PF app ([#1603](https://github.com/pagopa/pn-frontend/issues/1603)) ([04ca6b3](https://github.com/pagopa/pn-frontend/commit/04ca6b30d4d5f09c8252ee4a316a9d6ddec1e3df))
* **PN-16022:** expose .well-known files for appIO ([#1614](https://github.com/pagopa/pn-frontend/issues/1614)) ([bf8930a](https://github.com/pagopa/pn-frontend/commit/bf8930a02344d95d836a0597d8ea1e50b7820754))
* **PN-16022:** include .well-known folder in tar build ([#1615](https://github.com/pagopa/pn-frontend/issues/1615)) ([6f60a99](https://github.com/pagopa/pn-frontend/commit/6f60a99eb7eb54d3dc7e867c0c070c46af55bf93))





## [2.17.1](https://github.com/pagopa/pn-frontend/compare/v2.17.1-RC.2...v2.17.1) (2025-08-08)

**Note:** Version bump only for package pn-frontend





## [2.17.1-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.17.1-RC.1...v2.17.1-RC.2) (2025-08-07)


### Bug Fixes

* **PN-15402:** add missing mixpanel start event on SMS edit ([#1617](https://github.com/pagopa/pn-frontend/issues/1617)) ([3377538](https://github.com/pagopa/pn-frontend/commit/3377538f600cdf9e9d2988ac0df9e0e218c27994))





## [2.17.1-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.17.1-RC.0...v2.17.1-RC.1) (2025-08-07)


### Bug Fixes

* **PN-15402:** add email/sms popup events and fix some sercq handling events ([#1616](https://github.com/pagopa/pn-frontend/issues/1616)) ([6533202](https://github.com/pagopa/pn-frontend/commit/6533202b646465340b33a97cec082c5f64d5df1e))





## [2.17.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.17.0...v2.17.1-RC.0) (2025-07-31)


### Bug Fixes

* **PN-15402:** track new events of SERCQ ([#1595](https://github.com/pagopa/pn-frontend/issues/1595)) ([5f3d540](https://github.com/pagopa/pn-frontend/commit/5f3d540eb35d614dd119fdb11d5d820d271347e9))





# [2.17.0](https://github.com/pagopa/pn-frontend/compare/v2.17.0-RC.2...v2.17.0) (2025-07-24)

**Note:** Version bump only for package pn-frontend





# [2.17.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.17.0-RC.1...v2.17.0-RC.2) (2025-07-21)


### Bug Fixes

* **pn-15729:** add InformativeDialog for email during SERCQ activation wizard (PF and PG) ([#1599](https://github.com/pagopa/pn-frontend/issues/1599)) ([14beb5c](https://github.com/pagopa/pn-frontend/commit/14beb5cf8b3f1c94cde24673087953290c233b25))



## [2.16.2](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.3...v2.16.2) (2025-07-16)



## [2.16.2-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.2...v2.16.2-RC.3) (2025-07-15)


### Bug Fixes

* update localization for special contacts ([#1598](https://github.com/pagopa/pn-frontend/issues/1598)) ([78046f7](https://github.com/pagopa/pn-frontend/commit/78046f760f76dea249752cb9873809f97fe4c5b4))



## [2.16.2-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.1...v2.16.2-RC.2) (2025-07-15)



## [2.16.2-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.0...v2.16.2-RC.1) (2025-07-15)


### Bug Fixes

* **PN-15722:** restore localization for dod activation ([#1594](https://github.com/pagopa/pn-frontend/issues/1594)) ([b1da581](https://github.com/pagopa/pn-frontend/commit/b1da581961ce93d9ace515f80319d2370c9d54b8))



## [2.16.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.17.0-RC.0...v2.16.2-RC.0) (2025-07-14)


### Bug Fixes

* fix copy SERCQ (PG and PF) ([#1591](https://github.com/pagopa/pn-frontend/issues/1591)) ([c747fbf](https://github.com/pagopa/pn-frontend/commit/c747fbfddd7a2cc2851e2bd53d70fd1031f27978))
* **pn-15396:** update IO step in SERCQ activation ([#1575](https://github.com/pagopa/pn-frontend/issues/1575)) ([ea6a2c9](https://github.com/pagopa/pn-frontend/commit/ea6a2c9a5b7b4c3c4b94c214629871da684a2c36))
* **pn-15401:** update email and sms removal flow ([#1579](https://github.com/pagopa/pn-frontend/issues/1579)) ([9245bdd](https://github.com/pagopa/pn-frontend/commit/9245bdd1657b0e76a0a2742e2d5921941eef7484))
* **pn-15404:** update PEC activation flow ([#1582](https://github.com/pagopa/pn-frontend/issues/1582)) ([4459554](https://github.com/pagopa/pn-frontend/commit/44595547569a9e4ed397a2ebc75edfef79bb4094))


### Features

* **pn-15395:** Add Initial page to SERCQ activation/transfer wizard ([#1571](https://github.com/pagopa/pn-frontend/issues/1571)) ([819154a](https://github.com/pagopa/pn-frontend/commit/819154ad73798ede75d2fe635b0217770d7f04f2))
* **pn-15398:** Rework on SERCQ wizard navigation buttons ([#1573](https://github.com/pagopa/pn-frontend/issues/1573)) ([6e929bf](https://github.com/pagopa/pn-frontend/commit/6e929bfd3f3278a326adefdcd03a9c0d43617b97))
* **pn-15399:** add email/sms confirmation modal and change feedback step ([#1576](https://github.com/pagopa/pn-frontend/issues/1576)) ([cc4e60e](https://github.com/pagopa/pn-frontend/commit/cc4e60e20c4ad1c0a0d64d8c750302077c29aebf))
* **pn-15400:** add recap step for SERCQ activation wizard ([#1586](https://github.com/pagopa/pn-frontend/issues/1586)) ([c18c70e](https://github.com/pagopa/pn-frontend/commit/c18c70e3d8a7cc867786e017e3c4bb9d3df5c5c6))
* **PN-15403:** remove DATAPRIVACY_SERCQ  ([#1587](https://github.com/pagopa/pn-frontend/issues/1587)) ([4892cce](https://github.com/pagopa/pn-frontend/commit/4892cce13671b00794868488894212c9e92c0e75))






# [2.17.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.17.0-RC.0...v2.17.0-RC.1) (2025-07-16)


### Bug Fixes

* **pn-15747:** fixed wrong copy when a courtesy contact linked to a sender is deleted ([#1600](https://github.com/pagopa/pn-frontend/issues/1600)) ([bbff98e](https://github.com/pagopa/pn-frontend/commit/bbff98e0064f093dcba6066a45d39944cd12505f))





## [2.16.2](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.3...v2.16.2) (2025-07-16)

**Note:** Version bump only for package pn-frontend





## [2.16.2-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.2...v2.16.2-RC.3) (2025-07-15)


### Bug Fixes

* update localization for special contacts ([#1598](https://github.com/pagopa/pn-frontend/issues/1598)) ([78046f7](https://github.com/pagopa/pn-frontend/commit/78046f760f76dea249752cb9873809f97fe4c5b4))





## [2.16.2-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.1...v2.16.2-RC.2) (2025-07-15)

**Note:** Version bump only for package pn-frontend





## [2.16.2-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.16.2-RC.0...v2.16.2-RC.1) (2025-07-15)


### Bug Fixes

* **PN-15722:** restore localization for dod activation ([#1594](https://github.com/pagopa/pn-frontend/issues/1594)) ([b1da581](https://github.com/pagopa/pn-frontend/commit/b1da581961ce93d9ace515f80319d2370c9d54b8))





## [2.16.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.16.1...v2.16.2-RC.0) (2025-07-14)


### Bug Fixes

* fix copy SERCQ (PG and PF) ([#1591](https://github.com/pagopa/pn-frontend/issues/1591)) ([c747fbf](https://github.com/pagopa/pn-frontend/commit/c747fbfddd7a2cc2851e2bd53d70fd1031f27978))
* **pn-15396:** update IO step in SERCQ activation ([#1575](https://github.com/pagopa/pn-frontend/issues/1575)) ([ea6a2c9](https://github.com/pagopa/pn-frontend/commit/ea6a2c9a5b7b4c3c4b94c214629871da684a2c36))
* **pn-15401:** update email and sms removal flow ([#1579](https://github.com/pagopa/pn-frontend/issues/1579)) ([9245bdd](https://github.com/pagopa/pn-frontend/commit/9245bdd1657b0e76a0a2742e2d5921941eef7484))
* **pn-15404:** update PEC activation flow ([#1582](https://github.com/pagopa/pn-frontend/issues/1582)) ([4459554](https://github.com/pagopa/pn-frontend/commit/44595547569a9e4ed397a2ebc75edfef79bb4094))


### Features

* **pn-15395:** Add Initial page to SERCQ activation/transfer wizard ([#1571](https://github.com/pagopa/pn-frontend/issues/1571)) ([819154a](https://github.com/pagopa/pn-frontend/commit/819154ad73798ede75d2fe635b0217770d7f04f2))
* **pn-15398:** Rework on SERCQ wizard navigation buttons ([#1573](https://github.com/pagopa/pn-frontend/issues/1573)) ([6e929bf](https://github.com/pagopa/pn-frontend/commit/6e929bfd3f3278a326adefdcd03a9c0d43617b97))
* **pn-15399:** add email/sms confirmation modal and change feedback step ([#1576](https://github.com/pagopa/pn-frontend/issues/1576)) ([cc4e60e](https://github.com/pagopa/pn-frontend/commit/cc4e60e20c4ad1c0a0d64d8c750302077c29aebf))
* **pn-15400:** add recap step for SERCQ activation wizard ([#1586](https://github.com/pagopa/pn-frontend/issues/1586)) ([c18c70e](https://github.com/pagopa/pn-frontend/commit/c18c70e3d8a7cc867786e017e3c4bb9d3df5c5c6))
* **PN-15403:** remove DATAPRIVACY_SERCQ  ([#1587](https://github.com/pagopa/pn-frontend/issues/1587)) ([4892cce](https://github.com/pagopa/pn-frontend/commit/4892cce13671b00794868488894212c9e92c0e75))





# [2.17.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.16.1...v2.17.0-RC.0) (2025-07-09)


### Bug Fixes

* **PN-15052:** resolve bug not updating content after switching lang on PrivacyPolicy and ToS pages (PA, PF, PG) ([#1564](https://github.com/pagopa/pn-frontend/issues/1564)) ([2f4a494](https://github.com/pagopa/pn-frontend/commit/2f4a4942bcf8d7c6a95b7ad8731b236c05148ca2))
* **pn-15077:** fix existing tests and add new tests for sending errors to Zendesk ([#1561](https://github.com/pagopa/pn-frontend/issues/1561)) ([e4db5c1](https://github.com/pagopa/pn-frontend/commit/e4db5c10096504df65e3d8434f6e5217ddb71797))
* **pn-15077:** fix toast layout ([#1562](https://github.com/pagopa/pn-frontend/issues/1562)) ([b292473](https://github.com/pagopa/pn-frontend/commit/b292473b992377e834f02dd85163174065f343c8))
* **pn-15077:** fixed pn-commons tests ([#1581](https://github.com/pagopa/pn-frontend/issues/1581)) ([30f3cfa](https://github.com/pagopa/pn-frontend/commit/30f3cfae9f256475d77cb14052094f1f1d4bf6df))
* **PN-15123:** restored special contacts for courtesy contacts ([#1570](https://github.com/pagopa/pn-frontend/issues/1570)) ([631bf8b](https://github.com/pagopa/pn-frontend/commit/631bf8bdf3a40095138722d68a583eb2b3ad68f5))
* **PN-15230:** move DeliveryMandateNotFoundAppError translation to 'common' ns ([#1565](https://github.com/pagopa/pn-frontend/issues/1565)) ([58202a8](https://github.com/pagopa/pn-frontend/commit/58202a83a1f6cd85945c0a8b0da8de2479cf258e))
* **PN-15509:** add TPP available type in courtesy message ([#1583](https://github.com/pagopa/pn-frontend/issues/1583)) ([61fef6a](https://github.com/pagopa/pn-frontend/commit/61fef6a082e31b35e1f3805742c3f260c84b00bf))


### Features

* **PN-15325:** [PA] call API /logout and redirect to selfcare login after explicit logout ([#1572](https://github.com/pagopa/pn-frontend/issues/1572)) ([6e54137](https://github.com/pagopa/pn-frontend/commit/6e5413794e2d9a03ad9a8e57921e54840fe37bc5))
* **PN-15326:** PG call api logout before redirect ([#1577](https://github.com/pagopa/pn-frontend/issues/1577)) ([c6fc68e](https://github.com/pagopa/pn-frontend/commit/c6fc68e6a7f702e03c9d47541cb17019237d606a))
* **PN-15327:** PF call api logout before redirect ([#1578](https://github.com/pagopa/pn-frontend/issues/1578)) ([e9cc7e7](https://github.com/pagopa/pn-frontend/commit/e9cc7e72274c9fe374b5863a18d62949d84c1dad))





## [2.16.1](https://github.com/pagopa/pn-frontend/compare/v2.16.1-RC.1...v2.16.1) (2025-06-27)

**Note:** Version bump only for package pn-frontend





## [2.16.1-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.16.1-RC.0...v2.16.1-RC.1) (2025-06-26)


### Bug Fixes

* **pn-14941:** removed period from disclaimer checkbox ([727f996](https://github.com/pagopa/pn-frontend/commit/727f9966ecf1e4591ea9666647212846d0cee502))





## [2.16.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.16.0...v2.16.1-RC.0) (2025-06-26)


### Bug Fixes

* **pn-14941:** fixed pa tests ([3b7dc33](https://github.com/pagopa/pn-frontend/commit/3b7dc33186e443273092fa02ad89544e4ad8701f))
* **pn-14941:** removed period from disclaimer checkbox ([3e57762](https://github.com/pagopa/pn-frontend/commit/3e5776269b3859e095e70ddcf8e0103480cc9678))
* **pn-14941:** restored disclaimer on digital domicile ([#1566](https://github.com/pagopa/pn-frontend/issues/1566)) ([1612094](https://github.com/pagopa/pn-frontend/commit/161209414dd064df5a761234e7aca7337b70d23e))





# [2.16.0](https://github.com/pagopa/pn-frontend/compare/v2.16.0-RC.1...v2.16.0) (2025-06-12)

**Note:** Version bump only for package pn-frontend





# [2.16.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.15.1...v2.16.0-RC.1) (2025-06-06)



# [2.16.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.15.0...v2.16.0-RC.0) (2025-05-27)


### Bug Fixes

* change wrong centered layout for timeline attachments ([bc4486e](https://github.com/pagopa/pn-frontend/commit/bc4486e1ce920c41f229afb8ac8be126e7ba829e))
* fix wrong copy for CAD/ARCAD attachments in timeline (PF, PG) ([12707eb](https://github.com/pagopa/pn-frontend/commit/12707eba8d4a59342b25751ea70ec94a9ea7aba4))
* replace malfunction link ([0ba403a](https://github.com/pagopa/pn-frontend/commit/0ba403a99124eca821c80baf2fdf83f3fec6d2f9))


### Features

* add draft copy for CAD/ARCAD in timeline ([49c3756](https://github.com/pagopa/pn-frontend/commit/49c3756a404ff48cc16f49e497aceb355ce830ff))
* add draft copy for CAD/ARCAD in timeline ([#1547](https://github.com/pagopa/pn-frontend/issues/1547)) ([4f9dcbe](https://github.com/pagopa/pn-frontend/commit/4f9dcbeed3284f6b1d7a1747b745a22092be0ba3))
* add new optional traceId param into support requests (draft) ([4a446a7](https://github.com/pagopa/pn-frontend/commit/4a446a732866e5e3701704e0be03c27c0b93e52c))
* add PN_INVALID_BODY to errors for which technical data should be shown ([9eecd85](https://github.com/pagopa/pn-frontend/commit/9eecd856904c1e3d26f721615b13c00861ee129d))
* add showTechnicalData attribute to AppError class to differentiate errors for which tech data needs to be shown ([12e034f](https://github.com/pagopa/pn-frontend/commit/12e034f6b95ae1706fbb50ea71ed42479ddfa36a))
* add support utility to pn-commons ([2f8b34d](https://github.com/pagopa/pn-frontend/commit/2f8b34de7d3b212773b018275bad7615028f49f9))
* change AppError to support non auto-closing error messages (draft) ([78d5530](https://github.com/pagopa/pn-frontend/commit/78d5530514f2f322c224c3529b58298fea7f4cad))
* **pn-14233:** vas physical address lookup ([#1526](https://github.com/pagopa/pn-frontend/issues/1526)) ([20a651c](https://github.com/pagopa/pn-frontend/commit/20a651c8a7461524a322108eb95ccd2aaf06bd42))
* **PN-14823:** update link to downtime example link and update regex for htmlurl ([eb93ef6](https://github.com/pagopa/pn-frontend/commit/eb93ef6119a5e44475a0f17da358d5f839d7dc8b))





# [2.16.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.15.0...v2.16.0-RC.0) (2025-05-27)


### Bug Fixes

* change wrong centered layout for timeline attachments ([bc4486e](https://github.com/pagopa/pn-frontend/commit/bc4486e1ce920c41f229afb8ac8be126e7ba829e))
* fix wrong copy for CAD/ARCAD attachments in timeline (PF, PG) ([12707eb](https://github.com/pagopa/pn-frontend/commit/12707eba8d4a59342b25751ea70ec94a9ea7aba4))
* replace malfunction link ([0ba403a](https://github.com/pagopa/pn-frontend/commit/0ba403a99124eca821c80baf2fdf83f3fec6d2f9))


### Features

* add draft copy for CAD/ARCAD in timeline ([49c3756](https://github.com/pagopa/pn-frontend/commit/49c3756a404ff48cc16f49e497aceb355ce830ff))
* add draft copy for CAD/ARCAD in timeline ([#1547](https://github.com/pagopa/pn-frontend/issues/1547)) ([4f9dcbe](https://github.com/pagopa/pn-frontend/commit/4f9dcbeed3284f6b1d7a1747b745a22092be0ba3))
* add new optional traceId param into support requests (draft) ([4a446a7](https://github.com/pagopa/pn-frontend/commit/4a446a732866e5e3701704e0be03c27c0b93e52c))
* add PN_INVALID_BODY to errors for which technical data should be shown ([9eecd85](https://github.com/pagopa/pn-frontend/commit/9eecd856904c1e3d26f721615b13c00861ee129d))
* add showTechnicalData attribute to AppError class to differentiate errors for which tech data needs to be shown ([12e034f](https://github.com/pagopa/pn-frontend/commit/12e034f6b95ae1706fbb50ea71ed42479ddfa36a))
* add support utility to pn-commons ([2f8b34d](https://github.com/pagopa/pn-frontend/commit/2f8b34de7d3b212773b018275bad7615028f49f9))
* change AppError to support non auto-closing error messages (draft) ([78d5530](https://github.com/pagopa/pn-frontend/commit/78d5530514f2f322c224c3529b58298fea7f4cad))
* **pn-14233:** vas physical address lookup ([#1526](https://github.com/pagopa/pn-frontend/issues/1526)) ([20a651c](https://github.com/pagopa/pn-frontend/commit/20a651c8a7461524a322108eb95ccd2aaf06bd42))
* **PN-14823:** update link to downtime example link and update regex for htmlurl ([eb93ef6](https://github.com/pagopa/pn-frontend/commit/eb93ef6119a5e44475a0f17da358d5f839d7dc8b))

## [2.15.1](https://github.com/pagopa/pn-frontend/compare/v2.15.1-RC.0...v2.15.1) (2025-06-04)

**Note:** Version bump only for package pn-frontend





## [2.15.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.15.0...v2.15.1-RC.0) (2025-05-28)

**Note:** Version bump only for package pn-frontend





# [2.15.0](https://github.com/pagopa/pn-frontend/compare/v2.15.0-RC.2...v2.15.0) (2025-05-12)

**Note:** Version bump only for package pn-frontend





# [2.15.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.15.0-RC.1...v2.15.0-RC.2) (2025-05-06)


### Bug Fixes

* **PN-14852:** restore label included-costs ([#1543](https://github.com/pagopa/pn-frontend/issues/1543)) ([ffccbee](https://github.com/pagopa/pn-frontend/commit/ffccbee87735077318c0781b4c5c174e734d18dd))





# [2.15.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.15.0-RC.0...v2.15.0-RC.1) (2025-04-28)

**Note:** Version bump only for package pn-frontend





# [2.15.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.14.0...v2.15.0-RC.0) (2025-04-24)


### Bug Fixes

* **PN-11782:** Fix loading overlay a11y  ([#1496](https://github.com/pagopa/pn-frontend/issues/1496)) ([e3a89af](https://github.com/pagopa/pn-frontend/commit/e3a89afef372c48245acb08a8d9d7523274d179b))
* **pn-14012:** Show right copy when no issuer is present ([#1486](https://github.com/pagopa/pn-frontend/issues/1486)) ([ab7a3d0](https://github.com/pagopa/pn-frontend/commit/ab7a3d09b579427b7de0d261eb0893a648ad71bb))
* **PN-14346, PN-14348:** prevent set PEC address same as default one as special contact and show IO successfully added toast ([#1519](https://github.com/pagopa/pn-frontend/issues/1519)) ([112959b](https://github.com/pagopa/pn-frontend/commit/112959b2d4378f0649494669fc0f6adf2cf22fb3))


### Features

* **PN-11783:** rework UI of 404 page ([#1513](https://github.com/pagopa/pn-frontend/issues/1513)) ([806bc0f](https://github.com/pagopa/pn-frontend/commit/806bc0f1828f89333225a42fd4990b754cc6c170))
* **pn-14082:** Handle PN_DELIVERY_NOTIFICATION_LIMIT_EXCEEDED ([#1537](https://github.com/pagopa/pn-frontend/issues/1537)) ([adb5fd9](https://github.com/pagopa/pn-frontend/commit/adb5fd9b868de3ae164a743d283d2e45678191bb))
* **PN-14399:** update copy for payment items ([#1520](https://github.com/pagopa/pn-frontend/issues/1520)) ([ed02337](https://github.com/pagopa/pn-frontend/commit/ed02337bac510528a651ed27a2f29f6346b7fec0))





# [2.14.0](https://github.com/pagopa/pn-frontend/compare/v2.14.0-RC.1...v2.14.0) (2025-04-10)

**Note:** Version bump only for package pn-frontend





# [2.14.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.14.0-RC.0...v2.14.0-RC.1) (2025-04-08)


### Bug Fixes

* **PN-14412:** add Selfcare CDN URLs in Content Security Policy ([#1535](https://github.com/pagopa/pn-frontend/issues/1535)) ([1cda170](https://github.com/pagopa/pn-frontend/commit/1cda170ef0814c196766946a541e855a6e2d373b))





# [2.14.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.13.0...v2.14.0-RC.0) (2025-04-07)


### Bug Fixes

* **PN-13660:** hide name column on VirtualKeyTable for non-admin users (PG) ([#1510](https://github.com/pagopa/pn-frontend/issues/1510)) ([ca01555](https://github.com/pagopa/pn-frontend/commit/ca015558ceb711a32880f44645a4b623ac84a4e0))
* **PN-14107, PN-14197, PN-14205:** enhance Mixpanel SEND_HAS_PEC and SEND_HAS_SERCQ_SEND settings ([#1508](https://github.com/pagopa/pn-frontend/issues/1508)) ([212a710](https://github.com/pagopa/pn-frontend/commit/212a710d14dbf380034148c470a65ec5d2033ad1))
* **PN-14201:** copy of analog failure delivery in timeline when recipient is unreachable ([#1511](https://github.com/pagopa/pn-frontend/issues/1511)) ([89cf083](https://github.com/pagopa/pn-frontend/commit/89cf083f68b0ebea1a84debb271e3db62a21d09f))
* **PN-14217:** Preserve error on DebtPositionDetail and payment boxes when navigate between steps ([#1512](https://github.com/pagopa/pn-frontend/issues/1512)) ([dc9d407](https://github.com/pagopa/pn-frontend/commit/dc9d4074d934038320ef7e1198c13c73457cf89c))
* **PN-14218, PN-14240, PN-14241:** resolved some bugs about Digital Domicile rework ([#1509](https://github.com/pagopa/pn-frontend/issues/1509)) ([a2064b1](https://github.com/pagopa/pn-frontend/commit/a2064b1511fe33fff5d39a5f700c8c177d41ee85))
* **PN-14319:** add translation for invalid parameter error during SERCQ_SEND enabling ([#1514](https://github.com/pagopa/pn-frontend/issues/1514)) ([7513940](https://github.com/pagopa/pn-frontend/commit/7513940bed028d65524ca958273d80abb924ccd6))
* **PN-14326:** hide installment alert on F24 payment box when fee policy is FLAT_RATE ([#1515](https://github.com/pagopa/pn-frontend/issues/1515)) ([ff4580b](https://github.com/pagopa/pn-frontend/commit/ff4580bb85a66a28dcd523c6963ba032f00690ed))
* **PN-14328:** break text when F24 name is too long ([#1516](https://github.com/pagopa/pn-frontend/issues/1516)) ([95245e8](https://github.com/pagopa/pn-frontend/commit/95245e8f3c5e90ee3eaa33d0cc6c5d8c3c07d3fe))
* **PN-14402:** fix landing site url in config [#1527](https://github.com/pagopa/pn-frontend/issues/1527) ([bced898](https://github.com/pagopa/pn-frontend/commit/bced89804dbbc02b79979409c73ddbf7d7ec2130))


### Features

* **PN-13977:** Tests of notification creation with payment enabled ([#1492](https://github.com/pagopa/pn-frontend/issues/1492)) ([cf12063](https://github.com/pagopa/pn-frontend/commit/cf12063539072538cc1e583425b227e81bec2a9f))
* **pn-14334:** Add GitHub Action to update pn-bff dependency ([#1524](https://github.com/pagopa/pn-frontend/issues/1524)) ([21a7538](https://github.com/pagopa/pn-frontend/commit/21a7538841dcf4d632cffb81143381fa90366612))
* **PN-14412:** add organization logo to header on PG ([#1521](https://github.com/pagopa/pn-frontend/issues/1521)) ([66399fa](https://github.com/pagopa/pn-frontend/commit/66399fab43519e941b6f04ce1d07bab7eb2d4c18))





# [2.13.0](https://github.com/pagopa/pn-frontend/compare/v2.13.0-RC.2...v2.13.0) (2025-03-14)

**Note:** Version bump only for package pn-frontend





# [2.13.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.13.0-RC.1...v2.13.0-RC.2) (2025-03-11)


### Bug Fixes

* **PN-14123:** Fix some bugs on Digital Domicile ([#1504](https://github.com/pagopa/pn-frontend/issues/1504)) ([595520b](https://github.com/pagopa/pn-frontend/commit/595520bf7152ae3b97a21a94b4e6096bc2edfd53))
* **PN-14126:** set empty notificationFeePolicy in initialState ([#1499](https://github.com/pagopa/pn-frontend/issues/1499)) ([bb534f8](https://github.com/pagopa/pn-frontend/commit/bb534f8af89e319a8f2ec0716a87d32fd7b5bf08))
* **pn-14143:** set maximum 2 decimal to paFee ([#1500](https://github.com/pagopa/pn-frontend/issues/1500)) ([f663bf2](https://github.com/pagopa/pn-frontend/commit/f663bf210f3f80932f5a757cb5ae170f15aaaf43))
* **PN-14145:** cr ([9b9690f](https://github.com/pagopa/pn-frontend/commit/9b9690f747d74121cdfb3dea66cad48c2ed1d35f))
* **PN-14145:** fix copy as figma ([81c120d](https://github.com/pagopa/pn-frontend/commit/81c120ddc727f585487798105eba63b93815f367))
* **PN-14148:** Update formik recipient key to handle numeric CF in NewNotification ([#1497](https://github.com/pagopa/pn-frontend/issues/1497)) ([4c26c72](https://github.com/pagopa/pn-frontend/commit/4c26c7279d1347f6c7e3042d8757e42dace063ad))
* **PN-14157:** cast paFee only if present ([#1498](https://github.com/pagopa/pn-frontend/issues/1498)) ([4631e0f](https://github.com/pagopa/pn-frontend/commit/4631e0fa0befc99d5c983cb8298f4bb86c6689f2))
* **PN-14166:** clear payment fields when set debt position to NOTHING ([#1503](https://github.com/pagopa/pn-frontend/issues/1503)) ([9ce71bf](https://github.com/pagopa/pn-frontend/commit/9ce71bfcc432182493844cbc766c6827c7aa5250))
* **PN-14167:** fix mobile version ([3198925](https://github.com/pagopa/pn-frontend/commit/31989256b23c686748749c5fcaae382ea83b6f23))
* **PN-14167:** fix tablet version ([a1a343d](https://github.com/pagopa/pn-frontend/commit/a1a343d54053cdd8842b35afa9700b28f995af8c))


### Features

* **PN-13894:** add new Mixpanel strategy for UX event with psp property ([#1493](https://github.com/pagopa/pn-frontend/issues/1493)) ([a3e777d](https://github.com/pagopa/pn-frontend/commit/a3e777de802bf40d4e6187bc07a926dfae079ddd))






# [2.13.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.13.0-RC.0...v2.13.0-RC.1) (2025-03-03)


### Bug Fixes

* **PN-13257:** add description to button in notifications table ([#1491](https://github.com/pagopa/pn-frontend/issues/1491)) ([5988932](https://github.com/pagopa/pn-frontend/commit/5988932b3ac7c6dbe0f036f43907e448f4c02578))





# [2.13.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.12.0...v2.13.0-RC.0) (2025-02-28)


### Bug Fixes

* **pn-13250:** OTP modal accessibility ([#1467](https://github.com/pagopa/pn-frontend/issues/1467)) ([0d0f8ae](https://github.com/pagopa/pn-frontend/commit/0d0f8ae2d8a5eaacf342cc5a594c0203de46f179))
* **pn-13257:** tables accessibility ([#1462](https://github.com/pagopa/pn-frontend/issues/1462)) ([81a7208](https://github.com/pagopa/pn-frontend/commit/81a72085f576681e9e2ade91c056fd5d666ff4db))
* **pn-13388:** improve regex for redirect and robots header ([#1477](https://github.com/pagopa/pn-frontend/issues/1477)) ([4f1a316](https://github.com/pagopa/pn-frontend/commit/4f1a3162e7ae5827f118dd114f4c6b36cc11d895))
* **PN-13435:** rework of DefaultDigitalContact component ([#1418](https://github.com/pagopa/pn-frontend/issues/1418)) ([c0c8bf1](https://github.com/pagopa/pn-frontend/commit/c0c8bf173d8e0776ee960211a2124fa93ef75732))
* **PN-13437:** rework PecContactItem  ([#1421](https://github.com/pagopa/pn-frontend/issues/1421)) ([44c2af2](https://github.com/pagopa/pn-frontend/commit/44c2af2a79a79dde04a4abccee41fff1fdc2b705))
* **PN-13438:** rework special contacts section ([#1424](https://github.com/pagopa/pn-frontend/issues/1424)) ([d88e556](https://github.com/pagopa/pn-frontend/commit/d88e5569124b4408624ba41e4744dd9eb52321be))
* **PN-13485:** Fix a11y for filter of notification and delegation ([#1434](https://github.com/pagopa/pn-frontend/issues/1434)) ([0b89e7c](https://github.com/pagopa/pn-frontend/commit/0b89e7c778a2aa020ea22011b9eef61172f4df82))
* **pn-13588:** Show error when a pyament is not selected and focus on input when edit is clicked ([#1474](https://github.com/pagopa/pn-frontend/issues/1474)) ([6b139b3](https://github.com/pagopa/pn-frontend/commit/6b139b35b417a15eaf30047eaa87367bec2e249e))
* **pn-13588:** Show error when a pyament is not selected and focus on input when edit is clicked ([#1474](https://github.com/pagopa/pn-frontend/issues/1474)) ([fafd998](https://github.com/pagopa/pn-frontend/commit/fafd998cd32cbf6203d538c6c97b1506c70a52a5))
* **pn-13701:** Added aria-label to loading dialog ([#1483](https://github.com/pagopa/pn-frontend/issues/1483)) ([c6b5afb](https://github.com/pagopa/pn-frontend/commit/c6b5afb423937835319fe5bcc3d6c6df94dade61))
* **pn-13840:** Handle previously unhandled errors on sender dashboard ([#1465](https://github.com/pagopa/pn-frontend/issues/1465)) ([1f1fe43](https://github.com/pagopa/pn-frontend/commit/1f1fe4371aadfe1e6d780b2729664444d75b4ae6))
* **pn-13840:** updated error graph colors ([#1480](https://github.com/pagopa/pn-frontend/issues/1480)) ([9d9a15d](https://github.com/pagopa/pn-frontend/commit/9d9a15d92d662df2d8d5dce019eced9ad17cd90c))
* **PN-140001:** enable payment on notification creation ([#1488](https://github.com/pagopa/pn-frontend/issues/1488)) ([d2534c9](https://github.com/pagopa/pn-frontend/commit/d2534c9818ceda6b7f737b06504b8d5339a8d400))


### Features

* **pn-13436:** Rework LegalContacts component ([#1433](https://github.com/pagopa/pn-frontend/issues/1433)) ([74fe3d3](https://github.com/pagopa/pn-frontend/commit/74fe3d34f52ae599eb140b5f9ccfde730e0e1662))
* **PN-13439:** show informative dialog on courtesy contact activation ([#1422](https://github.com/pagopa/pn-frontend/issues/1422)) ([6d741b0](https://github.com/pagopa/pn-frontend/commit/6d741b0d5ee64686edf03b64114a5a023a5f7cb5))
* **pn-13447:** Add EmailSmsContactWizard component ([#1469](https://github.com/pagopa/pn-frontend/issues/1469)) ([7d4593f](https://github.com/pagopa/pn-frontend/commit/7d4593fadd9272f73996b29b86704967bd00181c))
* **pn-13449:** Create IO contact wizard component ([#1432](https://github.com/pagopa/pn-frontend/issues/1432)) ([cf84a62](https://github.com/pagopa/pn-frontend/commit/cf84a62bba591928cc1e60cac6a543c9db1c85b6))
* **pn-13450:** Digital Domicile Management ([#1446](https://github.com/pagopa/pn-frontend/issues/1446)) ([7721d93](https://github.com/pagopa/pn-frontend/commit/7721d9383d00e54d06b87a3b52af6f489a471674))
* **pn-13452:** Special Contacts Rework ([#1463](https://github.com/pagopa/pn-frontend/issues/1463)) ([7c3a4c8](https://github.com/pagopa/pn-frontend/commit/7c3a4c814906fbb4e934745be0a540fb07258cc8))
* **pn-13453:** Domicile Banner and Validating PEC Banner ([#1475](https://github.com/pagopa/pn-frontend/issues/1475)) ([30cbd6d](https://github.com/pagopa/pn-frontend/commit/30cbd6d651c63986b5f30f6b3e46c9872897dfa1))
* **pn-13455:** Remove no more used code ([#1479](https://github.com/pagopa/pn-frontend/issues/1479)) ([839bc95](https://github.com/pagopa/pn-frontend/commit/839bc955c7f9add5d558a28a8f85769310ea4fa4))
* **pn-13849:** view notification from retrieval Id ([#1466](https://github.com/pagopa/pn-frontend/issues/1466)) ([c2bde20](https://github.com/pagopa/pn-frontend/commit/c2bde205b23a0ee423cf3a339060e7ca09e2cd7d))
* **pn-13849:** view notification from retrieval Id ([#1466](https://github.com/pagopa/pn-frontend/issues/1466)) ([60b18e5](https://github.com/pagopa/pn-frontend/commit/60b18e5fdd9c996e7ace553ea49c96dc4a0d5410))
* **pn-13895:** [PG] pass source AAR in exchangeToken ([#1476](https://github.com/pagopa/pn-frontend/issues/1476)) ([33c109d](https://github.com/pagopa/pn-frontend/commit/33c109d8f5687bbbb5ae1cad5d34399dd2870752))
* **pn-13895:** [PG] pass source AAR in exchangeToken ([#1476](https://github.com/pagopa/pn-frontend/issues/1476)) ([5f2da71](https://github.com/pagopa/pn-frontend/commit/5f2da713e0cce937388d107f25d7e0a358de9e81))
* **pn-13915:** show custom payment button when user comes from TPP app ([#1468](https://github.com/pagopa/pn-frontend/issues/1468)) ([33ea7b6](https://github.com/pagopa/pn-frontend/commit/33ea7b6dbcdd076d5cdd7fdd2219700acb1107e4))
* **pn-13915:** show custom payment button when user comes from TPP app ([#1468](https://github.com/pagopa/pn-frontend/issues/1468)) ([96accd9](https://github.com/pagopa/pn-frontend/commit/96accd97aceca1ecbec43a384e68eac7ddaf3eb9))
* **pn-13918:** removed old payment fields ([#1464](https://github.com/pagopa/pn-frontend/issues/1464)) ([e8d7377](https://github.com/pagopa/pn-frontend/commit/e8d737700359285640242231c3ba953058ba71a6))
* **pn-13919:** replace notification dto with model from bff ([#1470](https://github.com/pagopa/pn-frontend/issues/1470)) ([073a078](https://github.com/pagopa/pn-frontend/commit/073a078e5716ed9efea13e108009736e98130005))
* **pn-13921:** prepared the PaymentMethods.tsx component for the new logic ([#1473](https://github.com/pagopa/pn-frontend/issues/1473)) ([ae1f1ac](https://github.com/pagopa/pn-frontend/commit/ae1f1ac107445dd61662cfe0976e3ac68603fa9b))
* **pn-13999:** Create debt position step on new notification ([#1478](https://github.com/pagopa/pn-frontend/issues/1478)) ([a4bc00c](https://github.com/pagopa/pn-frontend/commit/a4bc00ccb9c22f1e178618157e8179abcf90b964))
* **PN-14000) (PN-14001:** Debt position detail - manual notification creation([#1481](https://github.com/pagopa/pn-frontend/issues/1481)) ([9a44a40](https://github.com/pagopa/pn-frontend/commit/9a44a40dbe3d94f40af96d871e911d69cf050517))





# [2.12.0](https://github.com/pagopa/pn-frontend/compare/v2.12.0-RC.1...v2.12.0) (2025-02-18)

**Note:** Version bump only for package pn-frontend





# [2.12.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.12.0-RC.0...v2.12.0-RC.1) (2025-02-05)

**Note:** Version bump only for package pn-frontend





# [2.12.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.11.1...v2.12.0-RC.0) (2025-02-04)


### Bug Fixes

* **pn-13210:** manage accessibility when closing modal ([#1451](https://github.com/pagopa/pn-frontend/issues/1451)) ([2b4981b](https://github.com/pagopa/pn-frontend/commit/2b4981bddc8f6651ac47bb2cf371f63e33962959))
* **pn-13211:** Removed redirect when login fails ([#1445](https://github.com/pagopa/pn-frontend/issues/1445)) ([6ff0d2a](https://github.com/pagopa/pn-frontend/commit/6ff0d2aec98f161d5f23e7af49e41c31c7a7dcb7))
* **pn-13213:** aria label for payments and statistics checkboxes ([#1450](https://github.com/pagopa/pn-frontend/issues/1450)) ([0d4d250](https://github.com/pagopa/pn-frontend/commit/0d4d25007aa3c2012c6bd3cba235cc32e8d65be1))
* **pn-13214:** inactivity handler accessibility ([#1454](https://github.com/pagopa/pn-frontend/issues/1454)) ([7af07bd](https://github.com/pagopa/pn-frontend/commit/7af07bdc5861815ae484e0856d17f80ec3ac6096))
* **pn-13216:** Added descriptions to radio buttons ([#1444](https://github.com/pagopa/pn-frontend/issues/1444)) ([9fb7b79](https://github.com/pagopa/pn-frontend/commit/9fb7b79a755c6850d9ec2ffbb62aff60ec88e7a1))
* **pn-13255:** fixed aria attributes on the modal for revoking the delegation ([#1453](https://github.com/pagopa/pn-frontend/issues/1453)) ([cf2bfd9](https://github.com/pagopa/pn-frontend/commit/cf2bfd9844c412aa7f881a833c2fcaae01650355))
* **pn-13591:** Handle Calendar for a11y ([#1448](https://github.com/pagopa/pn-frontend/issues/1448)) ([7be12df](https://github.com/pagopa/pn-frontend/commit/7be12dfb572f2eb50e3f857d78174410b1a181ac))
* **pn-13593:** screen reader doesn't read api key value ([#1449](https://github.com/pagopa/pn-frontend/issues/1449)) ([7b11fb7](https://github.com/pagopa/pn-frontend/commit/7b11fb7ceb22d46bfd4dcea6bcbb6e1a2c3f85ae))
* **pn-13596:** screen reader doesn't read notification status tooltip on mobile ([#1439](https://github.com/pagopa/pn-frontend/issues/1439)) ([b28f472](https://github.com/pagopa/pn-frontend/commit/b28f47258e5bd3cf4d9a2a3c95b86bfb42114ce8))
* **pn-13598:** accessibility for the delegation tag group ([#1452](https://github.com/pagopa/pn-frontend/issues/1452)) ([a8626a2](https://github.com/pagopa/pn-frontend/commit/a8626a27ca23f9de030bc0b51d825d685bcee737))


### Features

* **pn-13215:** Screen reader doesn't read all the attachments in timeline ([#1442](https://github.com/pagopa/pn-frontend/issues/1442)) ([877bf49](https://github.com/pagopa/pn-frontend/commit/877bf49c486485f9e0ce6b04b6423a78824180e8))
* **pn-13595:** removed automatic redirect before logout ([#1456](https://github.com/pagopa/pn-frontend/issues/1456)) ([c7d823f](https://github.com/pagopa/pn-frontend/commit/c7d823f72e9e64eeeccfcafebb0b05f4b188959c))





## [2.11.1](https://github.com/pagopa/pn-frontend/compare/v2.11.0...v2.11.1) (2025-01-31)

**Note:** Version bump only for package pn-frontend





# [2.11.0](https://github.com/pagopa/pn-frontend/compare/v2.11.0-RC.2...v2.11.0) (2025-01-20)

**Note:** Version bump only for package pn-frontend





# [2.11.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.11.0-RC.1...v2.11.0-RC.2) (2025-01-14)


### Bug Fixes

* **pn-13028:** hide actions when public key is removed ([#1441](https://github.com/pagopa/pn-frontend/issues/1441)) ([f1c87d8](https://github.com/pagopa/pn-frontend/commit/f1c87d8a9369541e32b7213c79c6c2387ff8f8fa))





# [2.11.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.11.0-RC.0...v2.11.0-RC.1) (2025-01-10)


### Bug Fixes

* **pn-12958:** default color for disabled chip and fixed creation button visualization ([#1437](https://github.com/pagopa/pn-frontend/issues/1437)) ([4b63fa7](https://github.com/pagopa/pn-frontend/commit/4b63fa79c09cedc869a4a2a4abacd2d09bb3d03f))


### Features

* **pn-13265:** cache refresh updated for selfcare-PG ([#1413](https://github.com/pagopa/pn-frontend/issues/1413)) ([b5d2292](https://github.com/pagopa/pn-frontend/commit/b5d2292f2c7701f5f21858caf48ea6ed71352543))





# [2.11.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.10.0...v2.11.0-RC.0) (2025-01-10)


### Bug Fixes

* **pn-12727:** Fix of render a long title of notification ([#1408](https://github.com/pagopa/pn-frontend/issues/1408)) ([696ad4c](https://github.com/pagopa/pn-frontend/commit/696ad4c6f555e55711c4f50f50d1a47d0984b840))
* **pn-12958:** enhanced the visualization of the virtualkey section ([#1403](https://github.com/pagopa/pn-frontend/issues/1403)) ([48e8d55](https://github.com/pagopa/pn-frontend/commit/48e8d5548b12bf98ccc11d689247fb534bc713b6))
* **pn-12975:** hide menu in virtualKeysTable when no action is available ([#1406](https://github.com/pagopa/pn-frontend/issues/1406)) ([09cacea](https://github.com/pagopa/pn-frontend/commit/09cacea51f287149dd216e1074eaf1e95377c95c))
* **pn-13212:** chip stato notifica/pagamenti ([#1419](https://github.com/pagopa/pn-frontend/issues/1419)) ([015c83f](https://github.com/pagopa/pn-frontend/commit/015c83f76f6460acd847a3a4e5526145ee42c536))
* **pn-13269:** Translate AAR label in the notification detail page ([#1420](https://github.com/pagopa/pn-frontend/issues/1420)) ([05ee4f0](https://github.com/pagopa/pn-frontend/commit/05ee4f0cfdeb71779038d04ba83eb13569dbf029))
* **pn-9848:** Get TraceId from header ([#1176](https://github.com/pagopa/pn-frontend/issues/1176)) ([2e613a7](https://github.com/pagopa/pn-frontend/commit/2e613a722a0e667813a20eac1b12fc6936fa1322))


### Features

* **pn-13347:** add new status return to sender to timeline ([#1416](https://github.com/pagopa/pn-frontend/issues/1416)) ([82b17fa](https://github.com/pagopa/pn-frontend/commit/82b17faa6eeef406f9e75033246fd5f5f2a9dbda))
* **pn-13499:** improve configuration ([#1429](https://github.com/pagopa/pn-frontend/issues/1429)) ([e0956fb](https://github.com/pagopa/pn-frontend/commit/e0956fb6afcce8fd7fcd954105be74ab03e8b140))





# [2.10.0](https://github.com/pagopa/pn-frontend/compare/v2.10.0-RC.0...v2.10.0) (2025-01-07)

**Note:** Version bump only for package pn-frontend





# [2.10.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.9.0...v2.10.0-RC.0) (2024-11-29)


### Bug Fixes

* **12155:** hide toast error when check aar api returns notification not found ([#1384](https://github.com/pagopa/pn-frontend/issues/1384)) ([396b9ee](https://github.com/pagopa/pn-frontend/commit/396b9ee74c0580b49b70918d65b1d88589b840a2))
* **pn-11392:** more generic download message for those documents in glacier ([#1411](https://github.com/pagopa/pn-frontend/issues/1411)) ([bb93a20](https://github.com/pagopa/pn-frontend/commit/bb93a207cb4bd522cb48a6cd640ed827afdc2240))
* **pn-11648:** Close Drawer when clicking on side menu voice ([#1410](https://github.com/pagopa/pn-frontend/issues/1410)) ([e38420c](https://github.com/pagopa/pn-frontend/commit/e38420cef045e8dd08a35773731efaadba12f97b))
* **pn-12735:** set overflow-wrap property on CodeModal title to grant very long pec/mail addresses are shown ([#1407](https://github.com/pagopa/pn-frontend/issues/1407)) ([8137f7c](https://github.com/pagopa/pn-frontend/commit/8137f7c3b29b6b2e386a5f6aa07a44a69c60d3a1))
* **pn-13023:** update IO status in generalInfoSlice ([#1404](https://github.com/pagopa/pn-frontend/issues/1404)) ([308b499](https://github.com/pagopa/pn-frontend/commit/308b4991c4fe81310b5e98e52e939b654cd2b20f))
* **pn-13071:** Change how SERCQ component is displayed when PEC is enabled (PF and PG) ([#1377](https://github.com/pagopa/pn-frontend/issues/1377)) ([bdad114](https://github.com/pagopa/pn-frontend/commit/bdad1145fe44a3a1225384440fbff3f4ab992a1b))
* **pn-13073:** fix the order of legal contacts types ([#1381](https://github.com/pagopa/pn-frontend/issues/1381)) ([f241d4a](https://github.com/pagopa/pn-frontend/commit/f241d4a192314a9b26bfabeb7a575c13f524293a))
* **pn-13174:** Add blank spaces validation to digital contact input field (PF and PG) ([#1409](https://github.com/pagopa/pn-frontend/issues/1409)) ([9e2fe76](https://github.com/pagopa/pn-frontend/commit/9e2fe766edbd00fc251857de43d0ee4554de32d9))
* **pn-13314, pn-13353, pn-13324:** fixed max width on bilingual subjects, fixed PEC bilingual subject and fixed field reset on bilingual subjects ([#1412](https://github.com/pagopa/pn-frontend/issues/1412)) ([98b9549](https://github.com/pagopa/pn-frontend/commit/98b95499db44b99073052879ca97f0066fdeab66))


### Features

* **pn-13066:** manage taxonomy code error during notification creation (PA) ([#1388](https://github.com/pagopa/pn-frontend/issues/1388)) ([cf83f71](https://github.com/pagopa/pn-frontend/commit/cf83f713fea047466ef00f3ef7e03f9d4b282d4c))






# [2.9.0](https://github.com/pagopa/pn-frontend/compare/v2.9.0-RC.2...v2.9.0) (2024-11-18)

**Note:** Version bump only for package pn-frontend





# [2.9.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.9.0-RC.1...v2.9.0-RC.2) (2024-11-13)


### Bug Fixes

* **pn-13256:** fix documents form validation when fill the name before uploading the document ([#1405](https://github.com/pagopa/pn-frontend/issues/1405)) ([dcad6b6](https://github.com/pagopa/pn-frontend/commit/dcad6b6f01e3fc227e5079c5d1815e7fccbc172e))





# [2.9.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.9.0-RC.0...v2.9.0-RC.1) (2024-11-12)


### Bug Fixes

* validate lang in redirect url ([cb09bba](https://github.com/pagopa/pn-frontend/commit/cb09bba4a527de1dd72c9bc2641a61e0e27426cd))


### Features

* **PN-12891:** set one_trust_draft_mode on true in dev and test ([ca529b6](https://github.com/pagopa/pn-frontend/commit/ca529b681f76f0d1e6dba4f95c3fd20b1168530d))
* **pn-12896:** added drawer to set lang preference ([#1378](https://github.com/pagopa/pn-frontend/issues/1378)) ([2c2870e](https://github.com/pagopa/pn-frontend/commit/2c2870ec4b6b378a23989c4c0e030aec0a073ebb))
* **pn-12898:** add tests for new form components ([#1394](https://github.com/pagopa/pn-frontend/issues/1394)) ([9528eae](https://github.com/pagopa/pn-frontend/commit/9528eae7fccaa7acf6a8ebce56387927f33d704d))
* **pn-13039:** refactor 2nd step "recipient" in notification creation ([#1387](https://github.com/pagopa/pn-frontend/issues/1387)) ([f5e7604](https://github.com/pagopa/pn-frontend/commit/f5e7604030a1e57b121f60188cb7b64a6e614fbf))
* **pn-13040:** refactor 3rd step "attachments" in notification creation ([#1392](https://github.com/pagopa/pn-frontend/issues/1392)) ([9ae9cc9](https://github.com/pagopa/pn-frontend/commit/9ae9cc99cdea61f976a4a0170b0e162f254619f2))
* **pn-13043:** pre-select additionalLanguage from settings in the new notification wizard ([#1401](https://github.com/pagopa/pn-frontend/issues/1401)) ([e918ae2](https://github.com/pagopa/pn-frontend/commit/e918ae20f0c03111d1af8555a057472f449bf2cb))
* **PN-13234:** set one_trust_draft_mode to true in test and dev config ([0b6719b](https://github.com/pagopa/pn-frontend/commit/0b6719bd6e7d61433ae11587800544f5287f8733))
* **PN-13234:** set true ONE_TRUST_DRAFT_MODE in uat ([b5a832c](https://github.com/pagopa/pn-frontend/commit/b5a832ca06e12415b619b9822b1d2abd1e3f20d1))



## [2.8.2](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.1...v2.8.2) (2024-11-07)



## [2.8.2-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.0...v2.8.2-RC.1) (2024-11-04)



## [2.8.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.1...v2.8.2-RC.0) (2024-11-04)


### Bug Fixes

* **PN-13161:** add cache-control policies when fetching config.json ([d7718cb](https://github.com/pagopa/pn-frontend/commit/d7718cb030695539e892149846b11c2c59fa33b3))
* wrong cast for env variable ([329a67f](https://github.com/pagopa/pn-frontend/commit/329a67fda085015783d1d7f95c4a81e8f37fa009))
* wrong casting on env variable and fix wrong tests ([f596c3c](https://github.com/pagopa/pn-frontend/commit/f596c3cfdf588945467e5dda7af5a6d08d4c6c52))


### Features

* **PN-11636:** handle multi-language on PA ([7e94525](https://github.com/pagopa/pn-frontend/commit/7e945250434abb0614a2f00d4049305b0a2cfbd2))
* **PN-12889:** custom language detector in PF/PG/PA ([#1353](https://github.com/pagopa/pn-frontend/issues/1353)) ([1d65783](https://github.com/pagopa/pn-frontend/commit/1d6578364fdfbda063bacfa330fbfa87ed0ae476))
* **PN-12898:** additional language in notification manual creation ([#1366](https://github.com/pagopa/pn-frontend/issues/1366)) ([8c5447f](https://github.com/pagopa/pn-frontend/commit/8c5447f4a62f296c4652a253b7907075ed5403ce))
* **PN-1380:** add bilingualism banner in attachments tab ([#1380](https://github.com/pagopa/pn-frontend/issues/1380)) ([e2c6a6d](https://github.com/pagopa/pn-frontend/commit/e2c6a6d5369d1adb6baf81a4c787328adda44d30))





# [2.9.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.1...v2.9.0-RC.0) (2024-11-07)

### Bug Fixes

- **pn-12729:** duplicated payment when cart api goes in error ([#1360](https://github.com/pagopa/pn-frontend/issues/1360)) ([0c7c400](https://github.com/pagopa/pn-frontend/commit/0c7c400799a1256d0d0005e343a8fc15653da740))
- **pn-12897:** Channel type select initially empty in the dialog for the addition of a new special contact ([#1357](https://github.com/pagopa/pn-frontend/issues/1357)) ([f4e9ee0](https://github.com/pagopa/pn-frontend/commit/f4e9ee02be21d0e710a60fca98827fef9fef7afe))
- **pn-12958:** hide virtual key section when there is no public key ([#1375](https://github.com/pagopa/pn-frontend/issues/1375)) ([a7b154b](https://github.com/pagopa/pn-frontend/commit/a7b154b2199c421a1692e4b7bebfea373cfe9f1a))
- **PN-12960:** Show successful message on public key block/delete ([#1372](https://github.com/pagopa/pn-frontend/issues/1372)) ([366ada1](https://github.com/pagopa/pn-frontend/commit/366ada188f163c78cd7bb65caf17b17e9a6c8514))
- **PN-12968:** replace key name with user denomination in virtual key table for PG ([#1373](https://github.com/pagopa/pn-frontend/issues/1373)) ([f286afc](https://github.com/pagopa/pn-frontend/commit/f286afc77bfe81fb5393891870006577123bc0fe))
- **PN-13070:** add successful messages on appIO enable/disable (PF) ([#1376](https://github.com/pagopa/pn-frontend/issues/1376)) ([8f0d5e0](https://github.com/pagopa/pn-frontend/commit/8f0d5e075a59fce89958c52a6c1907216403bc47))
- **pn-13141:** show SercqSendIODialog after enabling SERCQ if the user has no courtesy contact ([#1389](https://github.com/pagopa/pn-frontend/issues/1389)) ([6dfc318](https://github.com/pagopa/pn-frontend/commit/6dfc318735dc2ab7703c7d6bd4b10a25c6865e98))

### Features

- **PN-11301:** create custom error type to handle PN_INVALID_BODY server response error for PF and PG ([#1371](https://github.com/pagopa/pn-frontend/issues/1371)) ([9d6f915](https://github.com/pagopa/pn-frontend/commit/9d6f9156c89e9102ff7d9f7c3370a6e883c84fde))
- **pn-13032:** update commitId and migrate to new getNotificationDocument ([#1383](https://github.com/pagopa/pn-frontend/issues/1383)) ([#1393](https://github.com/pagopa/pn-frontend/issues/1393)) ([bef2483](https://github.com/pagopa/pn-frontend/commit/bef24836df0ea4a249272c81def7c448c4b3bf13)), closes [#1390](https://github.com/pagopa/pn-frontend/issues/1390)

## [2.8.2](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.1...v2.8.2) (2024-11-07)

**Note:** Version bump only for package pn-frontend

## [2.8.2-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.8.2-RC.0...v2.8.2-RC.1) (2024-11-04)

**Note:** Version bump only for package pn-frontend

## [2.8.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.8.0...v2.8.2-RC.0) (2024-11-04)

### Bug Fixes

- **PN-13161:** add cache-control policies when fetching config.json ([d7718cb](https://github.com/pagopa/pn-frontend/commit/d7718cb030695539e892149846b11c2c59fa33b3))
- wrong cast for env variable ([329a67f](https://github.com/pagopa/pn-frontend/commit/329a67fda085015783d1d7f95c4a81e8f37fa009))
- wrong casting on env variable and fix wrong tests ([f596c3c](https://github.com/pagopa/pn-frontend/commit/f596c3cfdf588945467e5dda7af5a6d08d4c6c52))
- **PN-12757:** correct copy when timeline status is analog failure workflow ([#1351](https://github.com/pagopa/pn-frontend/issues/1351)) ([43e7b6e](https://github.com/pagopa/pn-frontend/commit/43e7b6ed5064d7ebaad51fbeba3b326342abad1c))
- **PN-12934:** now SercqSendCourtesyDialog does not appear when adding Sercq for a specific Party ([#1367](https://github.com/pagopa/pn-frontend/issues/1367)) ([8c15489](https://github.com/pagopa/pn-frontend/commit/8c15489c3edec1f64de0b63fc73ce65c1a74a3df))
- **PN-12966:** set maximum length for public key value ([#1365](https://github.com/pagopa/pn-frontend/issues/1365)) ([1c5cc00](https://github.com/pagopa/pn-frontend/commit/1c5cc0072e3c40560128611017c1a3dd005dc7c6))
- **PN-13045:** new API key confirmation component wrongly shows key id instead of value (PA) ([#1368](https://github.com/pagopa/pn-frontend/issues/1368)) ([e1b80d8](https://github.com/pagopa/pn-frontend/commit/e1b80d86d1ab976678bee358209487c5b5e374f9))

### Features

- **pn-12878:** New copy for analog flow ([#1359](https://github.com/pagopa/pn-frontend/issues/1359)) ([7fc60b1](https://github.com/pagopa/pn-frontend/commit/7fc60b1759762a9771a39cda6339985a041edcb0))

## [2.8.1](https://github.com/pagopa/pn-frontend/compare/v2.8.1-RC.1...v2.8.1) (2024-10-30)

## [2.7.1](https://github.com/pagopa/pn-frontend/compare/v2.8.0-RC.0...v2.7.1) (2024-10-14)

### Bug Fixes

- **PN-12893:** update PEC disclaimer message ([#1354](https://github.com/pagopa/pn-frontend/issues/1354)) ([5482db9](https://github.com/pagopa/pn-frontend/commit/5482db939047db5b8ba58c302c1683b3438d6497))

# [2.8.0](https://github.com/pagopa/pn-frontend/compare/v2.8.0-RC.3...v2.8.0) (2024-10-16)

**Note:** Version bump only for package pn-frontend

# [2.8.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.7.0...v2.8.0-RC.0) (2024-10-08)

## [2.7.1](https://github.com/pagopa/pn-frontend/compare/v2.7.0...v2.7.1) (2024-10-14)

### Bug Fixes

- **pn-12392:** Migrated to pg api for tos retrieve and acceptance ([#1335](https://github.com/pagopa/pn-frontend/issues/1335)) ([18596a6](https://github.com/pagopa/pn-frontend/commit/18596a68993fb3bcdf535bbdfccbea62f5f1b893))
- **pn-12392:** updated bff dependencies ([#1338](https://github.com/pagopa/pn-frontend/issues/1338)) ([b265ff7](https://github.com/pagopa/pn-frontend/commit/b265ff7e2eeae8b7895a80025592c93ab7c65d29))
- **pn-12394:** reset modal state when cancel is clicked ([#1339](https://github.com/pagopa/pn-frontend/issues/1339)) ([b65175c](https://github.com/pagopa/pn-frontend/commit/b65175c992cd90f9fcafaa0501bb60929faaafe5))
- **pn-12424:** disabling SERCQ SEND deletion when special address is added ([#1334](https://github.com/pagopa/pn-frontend/issues/1334)) ([fd45986](https://github.com/pagopa/pn-frontend/commit/fd45986b2079d039bf626d10f59dcc097da1977b))
- **pn-12537:** fixed layout when pec is in validation state ([#1340](https://github.com/pagopa/pn-frontend/issues/1340)) ([b26db35](https://github.com/pagopa/pn-frontend/commit/b26db357434bb76205144e178ef03238d3402181))
- **pn-12538:** fix banner condition ([#1341](https://github.com/pagopa/pn-frontend/issues/1341)) ([e14891c](https://github.com/pagopa/pn-frontend/commit/e14891c7ffad352538ecdaf2cdc60f49f183aa7c))
- **pn-12538:** fix bug on banner ([#1337](https://github.com/pagopa/pn-frontend/issues/1337)) ([37ecdd6](https://github.com/pagopa/pn-frontend/commit/37ecdd65e0e0c8d2443142b167e00db7430fd335))
- **pn-12538:** show AppIO banner when dod feature is disabled ([#1345](https://github.com/pagopa/pn-frontend/issues/1345)) ([a185c7e](https://github.com/pagopa/pn-frontend/commit/a185c7eb31e3418d1ea15e9637fe51e98a256112))
- **pn-12539:** localized sercq send event in timeline ([#1328](https://github.com/pagopa/pn-frontend/issues/1328)) ([10bb57f](https://github.com/pagopa/pn-frontend/commit/10bb57fad8d4dfcef005547484b553bca13792c4))
- **pn-12540:** fixed mixpanel missed events ([#1347](https://github.com/pagopa/pn-frontend/issues/1347)) ([67e5014](https://github.com/pagopa/pn-frontend/commit/67e50141c0bd51c5b5caf091ee3060bb1b7be153))
- **pn-12661:** fixed tos and privacy pages ([#1327](https://github.com/pagopa/pn-frontend/issues/1327)) ([436c838](https://github.com/pagopa/pn-frontend/commit/436c8387cac525c45d330337c0fa7fba8d2a0da8))
- **pn-12661:** updated tos and privacy pages for pg ([#1330](https://github.com/pagopa/pn-frontend/issues/1330)) ([019ed1a](https://github.com/pagopa/pn-frontend/commit/019ed1a076fd0ec2d9429626f129802d24638233))
- **pn-12740:** update accessibility link with last version ([#1329](https://github.com/pagopa/pn-frontend/issues/1329)) ([e9c7a1e](https://github.com/pagopa/pn-frontend/commit/e9c7a1e01fa3e2d4390e2b4ef4249f8e1fd58d08))
- **pn-12791:** Store and API for PG api keys ([#1332](https://github.com/pagopa/pn-frontend/issues/1332)) ([7e69eb4](https://github.com/pagopa/pn-frontend/commit/7e69eb41d3fd44ea833c140c58fe5984d805b729))

### Features

- **12777:** feature flag for B2B ([#1331](https://github.com/pagopa/pn-frontend/issues/1331)) ([6f6abf8](https://github.com/pagopa/pn-frontend/commit/6f6abf80603bf368f11529a95438c63c6f22ffc6))
- **pn-12392:** bff integration ([#1317](https://github.com/pagopa/pn-frontend/issues/1317)) ([4af8310](https://github.com/pagopa/pn-frontend/commit/4af8310b0d1191a94fe7527d65b53931c3a8abb0))
- **pn-12393:** add SERCQ value to channelType enumeration ([#1299](https://github.com/pagopa/pn-frontend/issues/1299)) ([b2384aa](https://github.com/pagopa/pn-frontend/commit/b2384aab2151de10d8a482c40e889eb06d5dbf85))
- **pn-12394:** reworked layout of contacts page ([#1301](https://github.com/pagopa/pn-frontend/issues/1301)) ([b300f49](https://github.com/pagopa/pn-frontend/commit/b300f499d2e2d12b5e6a5c304491a787df214c58))
- **pn-12405 :** reworked layout of EditDigitalContact ([#1302](https://github.com/pagopa/pn-frontend/issues/1302)) ([ab9abcf](https://github.com/pagopa/pn-frontend/commit/ab9abcf7f73b7066c076a02f6dd4fd351194c6df))
- **pn-12424:** Sercq SEND management - NO PEC case ([#1304](https://github.com/pagopa/pn-frontend/issues/1304)) ([ba9c225](https://github.com/pagopa/pn-frontend/commit/ba9c225b0cbaba6286b272415279515894c6dd89))
- **pn-12438:** Rework section "Altri recapiti" for Digital Domicile feature ([#1305](https://github.com/pagopa/pn-frontend/issues/1305)) ([adc18db](https://github.com/pagopa/pn-frontend/commit/adc18dbf44346eff1443a570ad3d963b466e938e))
- **pn-12438:** Rework special contacts section ([#1313](https://github.com/pagopa/pn-frontend/issues/1313)) ([57d3ec8](https://github.com/pagopa/pn-frontend/commit/57d3ec8503c24a3bf1e9b0416402b7dc52278e37))
- **pn-12492:** Add contacts summary cards ([#1310](https://github.com/pagopa/pn-frontend/issues/1310)) ([9832681](https://github.com/pagopa/pn-frontend/commit/98326814c22d039a6473ee8fe77f3da4b83a9aca))
- **pn-12537:** Pec addtion when sercq send is enabled as default address ([#1323](https://github.com/pagopa/pn-frontend/issues/1323)) ([3ff9ee3](https://github.com/pagopa/pn-frontend/commit/3ff9ee37781d1e268b24b58dcca5b695ea8d1ca7))
- **pn-12538:** work on banner for Digital Domicile ([#1324](https://github.com/pagopa/pn-frontend/issues/1324)) ([f155a93](https://github.com/pagopa/pn-frontend/commit/f155a939bbfc0e02d111907e191fb858187d0d57))
- **pn-12540:** Digital domicile mixpanel events ([#1321](https://github.com/pagopa/pn-frontend/issues/1321)) ([c0fbba7](https://github.com/pagopa/pn-frontend/commit/c0fbba7cd729698980d474a853e5173cc544500b))
- **pn-12661:** reworked layout ([#1318](https://github.com/pagopa/pn-frontend/issues/1318)) ([6a794a6](https://github.com/pagopa/pn-frontend/commit/6a794a6c7d9af6be7b9d8f6a6f47cbe97c6455eb))
- **pn-12741:** Reworked "Altri recapiti" section ([#1325](https://github.com/pagopa/pn-frontend/issues/1325)) ([23fbf82](https://github.com/pagopa/pn-frontend/commit/23fbf82b443604d6e903c33809a4c1569ed6b20e))
- **pn-12742:** Feature flag ([#1326](https://github.com/pagopa/pn-frontend/issues/1326)) ([eb2f8fe](https://github.com/pagopa/pn-frontend/commit/eb2f8fee093a2757462adf8dbe377f77ad6d5fce))
- **PN-12808:** update copy for digital domicile feature ([#1333](https://github.com/pagopa/pn-frontend/issues/1333)) ([9178a63](https://github.com/pagopa/pn-frontend/commit/9178a632dbf425d026878a08392d10f282eee2b9))
- **PN-12893:** update PEC disclaimer message ([#1354](https://github.com/pagopa/pn-frontend/issues/1354)) ([5482db9](https://github.com/pagopa/pn-frontend/commit/5482db939047db5b8ba58c302c1683b3438d6497))

# [2.7.0](https://github.com/pagopa/pn-frontend/compare/v2.7.0-RC.1...v2.7.0) (2024-09-18)

### Bug Fixes

- fixed failing tests ([#1320](https://github.com/pagopa/pn-frontend/issues/1320)) ([e10c0cd](https://github.com/pagopa/pn-frontend/commit/e10c0cdd54f2962653ca8914ad63351aaaca523e))

# [2.7.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.7.0-RC.0...v2.7.0-RC.1) (2024-09-10)

**Note:** Version bump only for package pn-frontend

# [2.7.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.6.1...v2.7.0-RC.0) (2024-09-09)

### Bug Fixes

- **pn-11700:** fixed horizontal scroll when title of F24 is too much long ([#1311](https://github.com/pagopa/pn-frontend/issues/1311)) ([e9a5135](https://github.com/pagopa/pn-frontend/commit/e9a51352cf85dddafffd509d8b0c335ec5d75c9b))
- **pn-11701:** use mobile version of date picker on small screens ([#1308](https://github.com/pagopa/pn-frontend/issues/1308)) ([fa65f36](https://github.com/pagopa/pn-frontend/commit/fa65f368921949973c2ba470496a9bead2202b72))
- **pn-11704:** fix group button allignment ([#1307](https://github.com/pagopa/pn-frontend/issues/1307)) ([cff4910](https://github.com/pagopa/pn-frontend/commit/cff49101fbf550264c1525e2e5c47fe0a41e8877))
- **pn-12097:** translation on breadcrumb ([#1284](https://github.com/pagopa/pn-frontend/issues/1284)) ([d6889a6](https://github.com/pagopa/pn-frontend/commit/d6889a6b0e0959b74ab8856a757cd676328df57f))
- **pn-12098:** app status chips color ([#1283](https://github.com/pagopa/pn-frontend/issues/1283)) ([9db4018](https://github.com/pagopa/pn-frontend/commit/9db4018e6800a21afa0b3006bb084449a1cf119c))
- **pn-12254:** added super property SEND_APPIO_STATUS ([#1306](https://github.com/pagopa/pn-frontend/issues/1306)) ([61d21f4](https://github.com/pagopa/pn-frontend/commit/61d21f4980fb8af55a248be8ccc707d2eabbcb94))
- **PN-12497:** set frame ancestors to none in CSP ([#1309](https://github.com/pagopa/pn-frontend/issues/1309)) ([5e1a865](https://github.com/pagopa/pn-frontend/commit/5e1a8653fe3fc69ed828997222802ec07f59e0d2))

### Features

- **pn-11371:** Remove useless aria-label and tabIndex attributes ([#1286](https://github.com/pagopa/pn-frontend/issues/1286)) ([22f8683](https://github.com/pagopa/pn-frontend/commit/22f868373e9b57e9512837bbac29a583ca9788b5))
- **pn-11896:** rework on courtesyAddressContacts ([#1267](https://github.com/pagopa/pn-frontend/issues/1267)) ([37839d7](https://github.com/pagopa/pn-frontend/commit/37839d77b3a06a795ba82b49612d9eb631fe606f))
- **pn-11898:** DigitalContactElem component refactor ([#1290](https://github.com/pagopa/pn-frontend/issues/1290)) ([ca61889](https://github.com/pagopa/pn-frontend/commit/ca6188964060fe74569e2ad9226b5daaaaac4300))
- **pn-11965:** Rework courtesy contact item ([#1291](https://github.com/pagopa/pn-frontend/issues/1291)) ([7b62ed5](https://github.com/pagopa/pn-frontend/commit/7b62ed5fe94ae03710395ad38a1d1a5567d35ec6))
- **pn-11966:** reworked PecContactItem ([#1293](https://github.com/pagopa/pn-frontend/issues/1293)) ([c55b4f6](https://github.com/pagopa/pn-frontend/commit/c55b4f6ac267e4ca7b1df14e6969ce2e275d5342))
- **pn-11969:** Remove context from courtesy contacts ([#1294](https://github.com/pagopa/pn-frontend/issues/1294)) ([fda5e6f](https://github.com/pagopa/pn-frontend/commit/fda5e6f9628bc37f1dd8d4cacb38664516c32605))
- **pn-11970:** removed context from PecContactItem ([#1295](https://github.com/pagopa/pn-frontend/issues/1295)) ([cb87d6c](https://github.com/pagopa/pn-frontend/commit/cb87d6cbff44b3b75030e15b4a6f5d191d1b4a97))
- **pn-12055:** Rework special contacts ([#1292](https://github.com/pagopa/pn-frontend/issues/1292)) ([644dbf6](https://github.com/pagopa/pn-frontend/commit/644dbf67f08b229bb6a37ff9203c5bd6b08ebb59))
- **pn-12056:** created two components for email and sms ([#1296](https://github.com/pagopa/pn-frontend/issues/1296)) ([f045c00](https://github.com/pagopa/pn-frontend/commit/f045c00fe804aa7cf8db6c7199bd247be1b46e36))
- **pn-12069:** use single contact component into SpecialContactElem ([#1297](https://github.com/pagopa/pn-frontend/issues/1297)) ([c35cd7f](https://github.com/pagopa/pn-frontend/commit/c35cd7fc66b59feb6b72c5b522d6fc2e674a3838))
- **pn-12070:** removed context from contacts ([#1298](https://github.com/pagopa/pn-frontend/issues/1298)) ([bd0892e](https://github.com/pagopa/pn-frontend/commit/bd0892e2a345a698703a2629709dcf4a502fc602))

## [2.6.1](https://github.com/pagopa/pn-frontend/compare/v2.6.0...v2.6.1) (2024-07-30)

### Bug Fixes

- **pn-12026:** Mixpanel regressions on login and super properties ([#1269](https://github.com/pagopa/pn-frontend/issues/1269)) ([c80070b](https://github.com/pagopa/pn-frontend/commit/c80070bc027dfa6aaf3dc5875d164399b6b12bbe))

# [2.6.0](https://github.com/pagopa/pn-frontend/compare/v2.6.0-RC.1...v2.6.0) (2024-07-22)

**Note:** Version bump only for package pn-frontend

# [2.6.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.6.0-RC.1...v2.6.0-RC.2) (2024-07-18)

**Note:** Version bump only for package pn-frontend

# [2.6.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.5.1...v2.6.0-RC.0) (2024-07-15)

### Bug Fixes

- **pn-10628:** SmartFilter component - close modal on submit button ([#1250](https://github.com/pagopa/pn-frontend/issues/1250)) ([e768063](https://github.com/pagopa/pn-frontend/commit/e768063211175d4844a6f4bc7a506e9ab2b458d0))
- **pn-10724:** Error when trying to open zendesk ticket with popup blocked ([#1262](https://github.com/pagopa/pn-frontend/issues/1262)) ([958660c](https://github.com/pagopa/pn-frontend/commit/958660c510614ea16b74585b4fe26e7278fb115c))
- **PN-11250:** fixed aar link for PG users ([#1224](https://github.com/pagopa/pn-frontend/issues/1224)) ([ba3d75a](https://github.com/pagopa/pn-frontend/commit/ba3d75a379bf2254cd10dd8edc87e4ee7c72d1d3))
- **pn-11331:** reworked login and access denied page to simplify html structure ([#1252](https://github.com/pagopa/pn-frontend/issues/1252)) ([ec27b89](https://github.com/pagopa/pn-frontend/commit/ec27b899e33ff1a43235e16b890952bd00be5196))
- **pn-11527:** block api key creation when edge spaces are used in the name ([#1248](https://github.com/pagopa/pn-frontend/issues/1248)) ([55a37bd](https://github.com/pagopa/pn-frontend/commit/55a37bd384973c8b7b86c87db9c77b8fb0fe54ba))
- **pn-11562:** set default value for statistics filter to 12 months ([#1255](https://github.com/pagopa/pn-frontend/issues/1255)) ([63c5091](https://github.com/pagopa/pn-frontend/commit/63c50912b5eb25ad364e57b73bf4b409db557b33))
- **pn-11618:** Added min and max width to DelegationsElements for pf and pg ([#1264](https://github.com/pagopa/pn-frontend/issues/1264)) ([3461f8e](https://github.com/pagopa/pn-frontend/commit/3461f8eb3b1539988de02c3e5c672e9e196350bc))
- **pn-11950:** add current organization in institutions when not present ([#1276](https://github.com/pagopa/pn-frontend/issues/1276)) ([3234549](https://github.com/pagopa/pn-frontend/commit/32345497089c0e6843ee1ac3e012de574b3230da))

### Features

- **pn-10800:** add sitemap.xml to PF/PG/PA ([#1265](https://github.com/pagopa/pn-frontend/issues/1265)) ([d8eb2c2](https://github.com/pagopa/pn-frontend/commit/d8eb2c21a60d03a435ecb99c3e122560af3a7173))
- **pn-11372:** Added env/shell: bash in the build script to avoid errors when running the generate script ([#1273](https://github.com/pagopa/pn-frontend/issues/1273)) ([880199d](https://github.com/pagopa/pn-frontend/commit/880199df9b17c5b85183b83a3a6780bcdab825da))
- **pn-11372:** Fixed scripts for sonarcolud and build pipeline ([#1271](https://github.com/pagopa/pn-frontend/issues/1271)) ([f656cd4](https://github.com/pagopa/pn-frontend/commit/f656cd479eceb9c092d4630aa4668d6f59955c70))
- **pn-11372:** Move client generation to the start, test and buil phases ([#1260](https://github.com/pagopa/pn-frontend/issues/1260)) ([da50caa](https://github.com/pagopa/pn-frontend/commit/da50caa9b690889aee218d3e466b57b49fee3e15))
- **pn-11563:** Add 'download jpeg' button to sender dashboard ([#1259](https://github.com/pagopa/pn-frontend/issues/1259)) ([89b0508](https://github.com/pagopa/pn-frontend/commit/89b05080935f9019c3c476e0ab40a1d8aa882b24))
- **pn-11564:** Sender dashboard - whole page component to manage the empty state ([#1254](https://github.com/pagopa/pn-frontend/issues/1254)) ([aab302e](https://github.com/pagopa/pn-frontend/commit/aab302e0e1ddb6f37629b5d7dce7e7d184e54d40))
- **pn-11747:** fixed PA tests ([#1275](https://github.com/pagopa/pn-frontend/issues/1275)) ([fc2a015](https://github.com/pagopa/pn-frontend/commit/fc2a015d9a046eb08e76cece622744e6778f1581))
- **pn-11747:** Handle multi language on PF ([#1274](https://github.com/pagopa/pn-frontend/issues/1274)) ([3ae5b39](https://github.com/pagopa/pn-frontend/commit/3ae5b39f6202091225cda8ddf742ea097cf83a13))
- **pn-7276:** Add required rule on pn-validator ([#1256](https://github.com/pagopa/pn-frontend/issues/1256)) ([6ddecf4](https://github.com/pagopa/pn-frontend/commit/6ddecf4b41c4c400e067003ec2384d84443bf22b))
- **pn-8849:** Validation on optional object ([#1257](https://github.com/pagopa/pn-frontend/issues/1257)) ([54d6e25](https://github.com/pagopa/pn-frontend/commit/54d6e25237fcee56653dcbeacd7b8247ef9b5efc))

## [2.5.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0...v2.5.1) (2024-06-26)

### Bug Fixes

- **pn-11775:** resolve an error on DigitalErrorTypes model causing the pa-webapp to crash ([#1263](https://github.com/pagopa/pn-frontend/issues/1263)) ([b5c84ff](https://github.com/pagopa/pn-frontend/commit/b5c84ffff7979369b715e2b1659ecdbe33be2d33))

# [2.5.0](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.2...v2.5.0) (2024-06-14)

**Note:** Version bump only for package pn-frontend

# [2.5.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.5.0-RC.0...v2.5.0-RC.1) (2024-06-05)

### Bug Fixes

- add charts aria configuration for sender dashboard ([#1240](https://github.com/pagopa/pn-frontend/issues/1240)) ([88a44e8](https://github.com/pagopa/pn-frontend/commit/88a44e81e03d63ffc43dd2ef8628522e1390ad88))
- change sender dashboard download button ([#1243](https://github.com/pagopa/pn-frontend/issues/1243)) ([5fabc3a](https://github.com/pagopa/pn-frontend/commit/5fabc3abae8ba3f860c6e9797db50eb3c5e2043d))
- **pn-11331:** improve readability of titles in PF login page ([#1230](https://github.com/pagopa/pn-frontend/issues/1230)) ([8a043aa](https://github.com/pagopa/pn-frontend/commit/8a043aadebee917f450305add54ecf6ed6a27fd9))
- **pn-11331:** Removed TabIndex and aria-selected from headings ([#1236](https://github.com/pagopa/pn-frontend/issues/1236)) ([8d55aa9](https://github.com/pagopa/pn-frontend/commit/8d55aa9db2888523b79b1e6b5e12a0842965c962))
- **PN-11334:** make closeIcon as button in drawer ([#1225](https://github.com/pagopa/pn-frontend/issues/1225)) ([3a2dded](https://github.com/pagopa/pn-frontend/commit/3a2dded902c69997bc5ce1aa310979cd1f757ffd))

### Features

- **PN-10910:** Integrate and test Sender Dashboard api ([#1223](https://github.com/pagopa/pn-frontend/issues/1223)) ([0b6f8b8](https://github.com/pagopa/pn-frontend/commit/0b6f8b8315acd5bb513207e33d0ccbe5fe5e9e4e))
- **pn-11273:** updated bff dependencies ([#1242](https://github.com/pagopa/pn-frontend/issues/1242)) ([0939949](https://github.com/pagopa/pn-frontend/commit/093994978a517c62aa21ce69089651e5fc2cb970))

# [2.5.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.4.2...v2.5.0-RC.0) (2024-05-30)

### Bug Fixes

- **pn-10637:** new mandate -> made case insensitive fiscalCode field ([#1217](https://github.com/pagopa/pn-frontend/issues/1217)) ([d9a91a4](https://github.com/pagopa/pn-frontend/commit/d9a91a4540ae8d4f2be78f14e7a812ae5268410e))
- **pn-10641:** contacts - show error message when user insert a wrong code twice ([#1219](https://github.com/pagopa/pn-frontend/issues/1219)) ([2338969](https://github.com/pagopa/pn-frontend/commit/2338969d0d8a751032b1d44a323149eb5e606381))
- **PN-10821:** Fix some Mixpanel regressions and track super profile properties ([#1200](https://github.com/pagopa/pn-frontend/issues/1200)) ([8dd9c41](https://github.com/pagopa/pn-frontend/commit/8dd9c419d42cc2eb0fd1e6adeab03b9b93c0b296))
- **pn-10930:** create notification -> remove digital address from recipient when it is not selected ([#1216](https://github.com/pagopa/pn-frontend/issues/1216)) ([42e3a78](https://github.com/pagopa/pn-frontend/commit/42e3a78521b79edd7665db7690bb6b967b4e197e))
- **pn-10941:** fixed preload request error ([#1221](https://github.com/pagopa/pn-frontend/issues/1221)) ([5388345](https://github.com/pagopa/pn-frontend/commit/53883453d73ea4e744897f89c2d3d09b72b8ef94))
- **pn-11219:** fixed `disservice_status` property on SEND_NOTIFICATION_DETAIL event ([ff2c706](https://github.com/pagopa/pn-frontend/commit/ff2c706d4df0978751f01e985a6864ebbf123717))

### Features

- **pn-10287:** Models autogeneration ([#1163](https://github.com/pagopa/pn-frontend/issues/1163)) ([b8f951e](https://github.com/pagopa/pn-frontend/commit/b8f951e1b6c838ef760c0ff21112fae72ac37b20))
- **pn-10579:** migrate tos and privacy api to bff ones ([#1192](https://github.com/pagopa/pn-frontend/issues/1192)) ([6ca28cc](https://github.com/pagopa/pn-frontend/commit/6ca28cc1c06cd222307ce056dde3e1a57085c00d))
- **pn-10587:** integrated institutions-and-products bff api ([#1194](https://github.com/pagopa/pn-frontend/issues/1194)) ([612ad98](https://github.com/pagopa/pn-frontend/commit/612ad98401e6da33b0619a7565a5f9ef06c102b1))
- **pn-10591:** migrated api key api to bff ones ([#1184](https://github.com/pagopa/pn-frontend/issues/1184)) ([3e3717d](https://github.com/pagopa/pn-frontend/commit/3e3717d248a2bc843dd47f87b6341f2fdb78217d))
- **pn-10738:** Downtime logs api bff integration ([#1196](https://github.com/pagopa/pn-frontend/issues/1196)) ([1602529](https://github.com/pagopa/pn-frontend/commit/16025293ac107a8df9948b606f7429ad89a7b5c5))
- **pN-10843:** notifications list api ([#1198](https://github.com/pagopa/pn-frontend/issues/1198)) ([b4e0fb6](https://github.com/pagopa/pn-frontend/commit/b4e0fb63a479be0242bef22a76fa4fc73ea81481))
- **pn-10851, PN-10451, PN-10846:** pn-data-viz setup, web api call for Sender statistics Dashboard ([#1202](https://github.com/pagopa/pn-frontend/issues/1202)) ([ad87fff](https://github.com/pagopa/pn-frontend/commit/ad87fffb9ac30989fdbca9ac2d4cbc02cd021033))
- **PN-10855:** Sender Dashboard components - aggregate and andamental charts ([#1214](https://github.com/pagopa/pn-frontend/issues/1214)) ([8900b8b](https://github.com/pagopa/pn-frontend/commit/8900b8bb9b80c3e4e4f66b8257403f16f6a8317a))
- **PN-10858:** Sender Dashboard Components 2/2 ([#1222](https://github.com/pagopa/pn-frontend/issues/1222)) ([f002364](https://github.com/pagopa/pn-frontend/commit/f0023640cfdf0bca360d9b01282a9deccc89f9cf))
- **pn-10889:** Download notification documents bff api ([#1199](https://github.com/pagopa/pn-frontend/issues/1199)) ([0586a3b](https://github.com/pagopa/pn-frontend/commit/0586a3b04be1401b9d1a3ed11051a1e3258c489c))
- **pn-10936:** payments api migration ([#1204](https://github.com/pagopa/pn-frontend/issues/1204)) ([0d27d4f](https://github.com/pagopa/pn-frontend/commit/0d27d4fcabe5f7b499ba1fa7ace647c009edf28a))
- **pn-10941:** new notification api migration ([#1218](https://github.com/pagopa/pn-frontend/issues/1218)) ([bce38ed](https://github.com/pagopa/pn-frontend/commit/bce38ed3d96c566ec259f1cc272b7d71c55e7e2b))
- **pn-10943:** cancel notification api migration ([#1203](https://github.com/pagopa/pn-frontend/issues/1203)) ([6cbe571](https://github.com/pagopa/pn-frontend/commit/6cbe5718a350e4e67702850c39c6e53e4d6e4bb9))
- **pn-10947:** list groups api migration ([#1207](https://github.com/pagopa/pn-frontend/issues/1207)) ([f7b5b89](https://github.com/pagopa/pn-frontend/commit/f7b5b89b9f703ced094c829602be4b24b588b29a))
- **pn-10951:** exchange qr code api migration ([#1210](https://github.com/pagopa/pn-frontend/issues/1210)) ([479bf47](https://github.com/pagopa/pn-frontend/commit/479bf477bdc6c94f6cabcc9ba5250335499bbda4))
- **pn-10953:** Mandate api migration ([#1209](https://github.com/pagopa/pn-frontend/issues/1209)) ([c85c72f](https://github.com/pagopa/pn-frontend/commit/c85c72f05e54ccf8bbdf6adf94f12dc9bc3cdebf))
- **pn-10957:** PG groups list api migration ([#1212](https://github.com/pagopa/pn-frontend/issues/1212)) ([3b96005](https://github.com/pagopa/pn-frontend/commit/3b960057d6f48fbeacb406d97bda87347c6ebcde))
- **pn-9831:** migration to bff api for notification detail ([#1153](https://github.com/pagopa/pn-frontend/issues/1153)) ([b3936dc](https://github.com/pagopa/pn-frontend/commit/b3936dcaccdb3cb9b134d21303559d0dd13be166))

## [2.4.2](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.3...v2.4.2) (2024-05-02)

**Note:** Version bump only for package send-monorepo

## [2.4.2-RC.3](https://github.com/pagopa/pn-frontend/compare/v2.4.2-RC.2...v2.4.2-RC.3) (2024-04-29)

### Bug Fixes

- **pn-10623:** Create notification with sender denomination greater than 80 characters ([#1197](https://github.com/pagopa/pn-frontend/issues/1197)) ([44dff14](https://github.com/pagopa/pn-frontend/commit/44dff14e44be442a42cdee3b0249d662b8a40724))

## [2.4.1](https://github.com/pagopa/pn-frontend/compare/v2.4.1-RC.1...v2.4.1) (2024-04-09)

**Note:** Version bump only for package send-monorepo

# [2.4.0](https://github.com/pagopa/pn-frontend/compare/v2.4.0-RC.0...v2.4.0) (2024-03-07)

**Note:** Version bump only for package send-monorepo

# [2.4.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.2...v2.4.0-RC.0) (2024-02-27)

### Bug Fixes

- **PN-10025:** added aria-label to button with IDP name ([#1138](https://github.com/pagopa/pn-frontend/issues/1138)) ([c24c02b](https://github.com/pagopa/pn-frontend/commit/c24c02be95d92e1e44e5128070d98f0a3c5f3061))
- **pn-9145:** added test case for duplicated protocol error ([#1120](https://github.com/pagopa/pn-frontend/issues/1120)) ([d2ca754](https://github.com/pagopa/pn-frontend/commit/d2ca754e07ed665211dab7a6d9e92d35b89ddee6))

### Features

- **PN-9684:** implemented alert in notificationDetail for alternative-RADD ([#1134](https://github.com/pagopa/pn-frontend/issues/1134)) ([bfc1d4a](https://github.com/pagopa/pn-frontend/commit/bfc1d4ad8d085d5691853fb54d1dad6049ca5f92))

### Reverts

- Revert "Release/v2.3.2" (#1143) ([7cfe17e](https://github.com/pagopa/pn-frontend/commit/7cfe17e1dffd43d0ffc7c0081dbdd538e0691fb6)), closes [#1143](https://github.com/pagopa/pn-frontend/issues/1143)
- Revert "fix(PN-10025): added aria-label to button with IDP name (#1138)" (#1140) ([2559495](https://github.com/pagopa/pn-frontend/commit/25594959e7184c0ae7dc59839845eda7cbd900d5)), closes [#1138](https://github.com/pagopa/pn-frontend/issues/1138) [#1140](https://github.com/pagopa/pn-frontend/issues/1140)

## [2.3.2](https://github.com/pagopa/pn-frontend/compare/v2.3.1...v2.3.2) (2024-02-20)

### Bug Fixes

- **PN-10025:** added aria-label to button with IDP name ([#1141](https://github.com/pagopa/pn-frontend/issues/1141)) ([2554c60](https://github.com/pagopa/pn-frontend/commit/2554c60c302dab1ebb8784040fc0c8fc2a225e5f))

## [2.3.1](https://github.com/pagopa/pn-frontend/compare/v2.3.1-RC.1...v2.3.1) (2024-02-19)

**Note:** Version bump only for package send-monorepo

## [2.3.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0...v2.3.1-RC.0) (2024-02-14)

### Bug Fixes

- **PN-8916:** logging out user when receiving a 403 ([#1116](https://github.com/pagopa/pn-frontend/issues/1116)) ([afed98a](https://github.com/pagopa/pn-frontend/commit/afed98a569ee446177d8b9214eed099a44c88fac))
- **PN-9412:** fix alert message when AAR not available for PA ([#1123](https://github.com/pagopa/pn-frontend/issues/1123)) ([3200b08](https://github.com/pagopa/pn-frontend/commit/3200b08df59c4139423aa4c8fe8cb285d5183c66))
- **PN-9659:** replaced API_B2B_LINK value in config file in all environment of PA ([#1122](https://github.com/pagopa/pn-frontend/issues/1122)) ([71bde4d](https://github.com/pagopa/pn-frontend/commit/71bde4dfb2b45ebfcc1761b941505268c74a75c8))
- **PN-9689:** replaced copy '10 minuti' with '15 minuti' in pop-up message when update o insert email, pec and sms address for PG and PF ([#1121](https://github.com/pagopa/pn-frontend/issues/1121)) ([e5df8dc](https://github.com/pagopa/pn-frontend/commit/e5df8dc0701bd616e97587fa1ecfaecd18e4cd70))
- **PN-9774:** added SEND_RAPID_ACCESS event and made some fixes ([#1135](https://github.com/pagopa/pn-frontend/issues/1135)) ([f2cf4d1](https://github.com/pagopa/pn-frontend/commit/f2cf4d18d33ba4901c4bacab9c13b1be7b9dcdf0))
- **PN-9873:** disabled button for downloading f24 when another f24 is already downloading ([#1128](https://github.com/pagopa/pn-frontend/issues/1128)) ([95fcd5e](https://github.com/pagopa/pn-frontend/commit/95fcd5e1bfe61b25f6fe82dc88dcafc166c1cf88))
- **PN-9939:** fix in products.json ([#1130](https://github.com/pagopa/pn-frontend/issues/1130)) ([ab1af2c](https://github.com/pagopa/pn-frontend/commit/ab1af2c0d74fbd3ca01063640fd36c54e4754ef4))
- **PN-9954:** fixed yarn installation in codebuilders ([0e9554f](https://github.com/pagopa/pn-frontend/commit/0e9554f55295947b40113600bedf9f1468ecee2f))

### Features

- **pn-9774:** added some new tracking events for user monitoring ([#1129](https://github.com/pagopa/pn-frontend/issues/1129)) ([45704ff](https://github.com/pagopa/pn-frontend/commit/45704fffcc1c1d89a41bf21ecc942defd49dcf57))
- **PN-9883:** added new version segment for notification detail and creation API ([#1126](https://github.com/pagopa/pn-frontend/issues/1126)) ([6599a2d](https://github.com/pagopa/pn-frontend/commit/6599a2d8a05b73ea11cdd7ffcbb9c4d837abafb8))

# [2.3.0](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.2...v2.3.0) (2024-01-25)

**Note:** Version bump only for package send-monorepo

# [2.3.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.1...v2.3.0-RC.2) (2024-01-24)

### Bug Fixes

- **PN-9541:** Logout from ToS and PP page ([#1118](https://github.com/pagopa/pn-frontend/issues/1118)) ([b143072](https://github.com/pagopa/pn-frontend/commit/b143072f7ac4f03383117aa05db7afed7f5c28bf))
- **pn-9624:** updated vitest config for coverage analysis ([#1115](https://github.com/pagopa/pn-frontend/issues/1115)) ([c940dd9](https://github.com/pagopa/pn-frontend/commit/c940dd9f3be6b78f5c2ef0df0e9628caf05d245a))

# [2.3.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.3.0-RC.0...v2.3.0-RC.1) (2024-01-19)

**Note:** Version bump only for package send-monorepo

## [2.2.4](https://github.com/pagopa/pn-frontend/compare/v2.2.4-RC.0...v2.2.4) (2024-01-12)

**Note:** Version bump only for package send-monorepo

## [2.2.4-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.3...v2.2.4-RC.0) (2024-01-03)

### Bug Fixes

- **PN-7003:** updated sentence for pf in proxy creation page and modal for watching code ([d73399f](https://github.com/pagopa/pn-frontend/commit/d73399fe12b104eac97d8f92d952791a791ef6ef))
- **PN-7004:** update sentences for pg in proxy page and modal ([6923246](https://github.com/pagopa/pn-frontend/commit/6923246826aae8edac9b063ae77feb05c136f14d))

## [2.2.3](https://github.com/pagopa/pn-frontend/compare/v2.2.3-RC.0...v2.2.3) (2023-12-14)

**Note:** Version bump only for package send-monorepo

## [2.2.3-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.2...v2.2.3-RC.0) (2023-12-12)

### Bug Fixes

- **pn-7067:** Added mobile support for buttons in new notification page ([#1051](https://github.com/pagopa/pn-frontend/issues/1051)) ([fb31399](https://github.com/pagopa/pn-frontend/commit/fb313999fb8f46edfb66596b89108645901f07dd))
- **pn-8287:** pg - fixed links to selfcare users and groups pages ([#1050](https://github.com/pagopa/pn-frontend/issues/1050)) ([76e6b2d](https://github.com/pagopa/pn-frontend/commit/76e6b2d66be91a0349752359875e183b701b8ac8))
- **pn-8589:** updated babel library to fix security vulnerability ([#1040](https://github.com/pagopa/pn-frontend/issues/1040)) ([91bbe13](https://github.com/pagopa/pn-frontend/commit/91bbe13cf3ca2a371526e635e29da038f8e7c453))
- **pn-8619:** fixed "from date" and "to date" filters in pa/pf/pg ([#1067](https://github.com/pagopa/pn-frontend/issues/1067)) ([f37bcb0](https://github.com/pagopa/pn-frontend/commit/f37bcb00b120468b0d442e1db51c4536e9da7a79))
- **PN-8692:** modify copy for event recrn-005-c-in-timeline ([#1055](https://github.com/pagopa/pn-frontend/issues/1055)) ([f9a645d](https://github.com/pagopa/pn-frontend/commit/f9a645d09b3fab387293593a2d32c71598f18353))
- **pn-8850:** Moved documents above payments box and changed title variant ([#1069](https://github.com/pagopa/pn-frontend/issues/1069)) ([3050dff](https://github.com/pagopa/pn-frontend/commit/3050dff56926ef08f5c486303bec314b57abd9a2))
- **pn-8862:** pa - date filter isn't emptied when the value is manually cancelled ([#1074](https://github.com/pagopa/pn-frontend/issues/1074)) ([c8d6569](https://github.com/pagopa/pn-frontend/commit/c8d656954e7fee1e6451ff2389aa90a61ed1342c))
- **PN-8869:** No "download" button for payments having no attachment ([#1079](https://github.com/pagopa/pn-frontend/issues/1079)) ([e5d26fc](https://github.com/pagopa/pn-frontend/commit/e5d26fcb5cadc0fb409b24191c68273e854825ba))
- **PN-8874:** fix aar to make it dowloadable after 120 days ([#1082](https://github.com/pagopa/pn-frontend/issues/1082)) ([d578f50](https://github.com/pagopa/pn-frontend/commit/d578f50b500bfb056b25512f8ec05cd616047bfd))
- **PN-8900:** Removed loaded method from mixpanel ([#1080](https://github.com/pagopa/pn-frontend/issues/1080)) ([a86022f](https://github.com/pagopa/pn-frontend/commit/a86022f0a55b610a724fb236db62eb5d382b6d8e))
- **PN-8901:** Fixed mixpanel events and renaming, and attributes ([#1078](https://github.com/pagopa/pn-frontend/issues/1078)) ([5a42baf](https://github.com/pagopa/pn-frontend/commit/5a42baf356b4b9e7e31949b36507bffe94b8236c))
- **pn-8912:** Removed title when all payments are paid ([#1083](https://github.com/pagopa/pn-frontend/issues/1083)) ([151d8bc](https://github.com/pagopa/pn-frontend/commit/151d8bcdec67bc34cbd45ea70d21acf9b4fc70f5))
- **PN-8984:** Fixed issues with mixPanel events ([#1086](https://github.com/pagopa/pn-frontend/issues/1086)) ([729121a](https://github.com/pagopa/pn-frontend/commit/729121a8abe947d0d2a273dc29da4f611a3292dc))
- **pn-9001:** Fixed product url calculation using product id ([#1084](https://github.com/pagopa/pn-frontend/issues/1084)) ([e3ddd3f](https://github.com/pagopa/pn-frontend/commit/e3ddd3f2472f3de50dddbcb778958c34a7f3ba8c))

### Features

- **pn-7003:** added 7-days expiration message to the delegation creation page and to the modal for the code viewing ([#1054](https://github.com/pagopa/pn-frontend/issues/1054)) ([94ee1df](https://github.com/pagopa/pn-frontend/commit/94ee1dfc0c8a8bfdee401a41586c2e26ecf4080a))
- **pn-7341:** payment pagination for pg/pf webapp [#1049](https://github.com/pagopa/pn-frontend/issues/1049) ([0438504](https://github.com/pagopa/pn-frontend/commit/04385044f09ad93f859a87fb0c7143528f5ae1df))
- **pn-7437:** Added new mixpanel events for PF ([#1065](https://github.com/pagopa/pn-frontend/issues/1065)) ([64d79ad](https://github.com/pagopa/pn-frontend/commit/64d79adb10ae715b1f0a16133b83c8fbb473daa5))
- **PN-7437:** added new tracking events for pf ([#1077](https://github.com/pagopa/pn-frontend/issues/1077)) ([b5ff12d](https://github.com/pagopa/pn-frontend/commit/b5ff12d0c8789d0d16ae60c9b23053f3fe853ca3))
- **PN-8737:** Added taxId validation according to PF (only length 16) or PG (only length 11) recipient ([#1070](https://github.com/pagopa/pn-frontend/issues/1070)) ([507113f](https://github.com/pagopa/pn-frontend/commit/507113f126815069c705facbdb4c5c7efbe1108e))
- **PN-8789:** Cancel notification button shown as administrator role only ([#1072](https://github.com/pagopa/pn-frontend/issues/1072)) ([3f0946c](https://github.com/pagopa/pn-frontend/commit/3f0946c1d0ef74293dea1c269384a8fdb10d8e0f))
- **pn-8995:** added copy for new analog-workflow-attachment-kind 23I, in all languages, for PA / PF / PG ([#1085](https://github.com/pagopa/pn-frontend/issues/1085)) ([366ec01](https://github.com/pagopa/pn-frontend/commit/366ec0134a04fdecd7c103d3b455654d5b951622))
- **pn-9009:** removed note about limit of 7 days to accept a delegation (PF and PG). ([#1088](https://github.com/pagopa/pn-frontend/issues/1088)) ([aec5766](https://github.com/pagopa/pn-frontend/commit/aec5766e31afc547e06472e21d0f03632769a6fe))

### Reverts

- Revert "feat(pn-7437): Added new mixpanel events for PF (#1065)" (#1075) ([559a927](https://github.com/pagopa/pn-frontend/commit/559a92768f69e83f4f23848d6fa0408566604aa8)), closes [#1065](https://github.com/pagopa/pn-frontend/issues/1065) [#1075](https://github.com/pagopa/pn-frontend/issues/1075)

## [2.2.2](https://github.com/pagopa/pn-frontend/compare/v2.2.2-RC.0...v2.2.2) (2023-11-21)

**Note:** Version bump only for package send-monorepo

## [2.2.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.2.1...v2.2.2-RC.0) (2023-11-21)

### Bug Fixes

- **PN-8735:** Fix overflow of f24 items on notification payment box of PA ([#1060](https://github.com/pagopa/pn-frontend/issues/1060)) ([752f47d](https://github.com/pagopa/pn-frontend/commit/752f47ddaed29919f0da4d90d1f978dcd26dd74f))
- **PN-8835:** subtitle copy when having a single payment ([#1066](https://github.com/pagopa/pn-frontend/issues/1066)) ([b96408d](https://github.com/pagopa/pn-frontend/commit/b96408dd8f3ec5d7a27f8711b3ebbb6e19c4a3c9))

## [2.2.1](https://github.com/pagopa/pn-frontend/compare/v2.1.4...v2.2.1) (2023-11-21)

# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.2.0) (2023-11-16)

# [2.2.0-RC.2](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.1...v2.2.0-RC.2) (2023-11-03)

### Bug Fixes

- **pn-8597:** fixed padding of the ConfirmationModal ([#1036](https://github.com/pagopa/pn-frontend/issues/1036)) ([8356e26](https://github.com/pagopa/pn-frontend/commit/8356e265510da26f6fc6466e7c7823b8959f6a01))
- **pn-8608:** AppStatus - today label not translated ([#1035](https://github.com/pagopa/pn-frontend/issues/1035)) ([9da483d](https://github.com/pagopa/pn-frontend/commit/9da483d0e7138744234006efa289f9a072fb989c))
- **pn-8614:** today label localization ([#1037](https://github.com/pagopa/pn-frontend/issues/1037)) ([d62daf8](https://github.com/pagopa/pn-frontend/commit/d62daf8067903b3fc24ecb0c6b8f6d740f588af7))
- **PN-8627:** Added translation support for timeline ([#1047](https://github.com/pagopa/pn-frontend/issues/1047)) ([190c25b](https://github.com/pagopa/pn-frontend/commit/190c25b3854c051283745757bac5e7ddcc4f65dc))
- **pn-8628:** replaced strings traslation for subtitle in notification detail page ([#1043](https://github.com/pagopa/pn-frontend/issues/1043)) ([d3464c7](https://github.com/pagopa/pn-frontend/commit/d3464c771c5dd641af4a6a9fd4103b8b92c580b7))
- **PN-8629:** replaced translation string for Active in delegation page ([#1042](https://github.com/pagopa/pn-frontend/issues/1042)) ([e23effa](https://github.com/pagopa/pn-frontend/commit/e23effa855c50fd59d142a76ebeebcdda55560a8))
- **pn-8630:** Replaced tax code text with fiscal code ([#1041](https://github.com/pagopa/pn-frontend/issues/1041)) ([67572fa](https://github.com/pagopa/pn-frontend/commit/67572faf8b866d1ecc26427cd2bcffcbdcf1e8e7))
- **PN-8633:** Fixed missing translation for Privacy Policy in footer ([#1045](https://github.com/pagopa/pn-frontend/issues/1045)) ([1d8b8fc](https://github.com/pagopa/pn-frontend/commit/1d8b8fc11a07d11baa1d4612d290397840277c48))
- **PN-8639:** Added translation support for datepicker ([#1046](https://github.com/pagopa/pn-frontend/issues/1046)) ([6912d7e](https://github.com/pagopa/pn-frontend/commit/6912d7e85b2bcad8bd807fbcf7640afc46ee9f3e))

### Features

- **pn-7858:** removed disambiguation page from code ([#1031](https://github.com/pagopa/pn-frontend/issues/1031)) ([68a7a32](https://github.com/pagopa/pn-frontend/commit/68a7a32abf2bacb4d90d8e8b64f9bb28599e119b))
- **PN-8116:** added codeowners file ([8b811ba](https://github.com/pagopa/pn-frontend/commit/8b811baf411fd3bf5eddde3c2eb9ab91eb5354dd))
- **pn-8575:** product and party switch refactoring ([#1039](https://github.com/pagopa/pn-frontend/issues/1039)) ([b1b82a7](https://github.com/pagopa/pn-frontend/commit/b1b82a7662398c2aed3e6615751527e4b2aaca94))

# [2.2.0-RC.1](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.0...v2.2.0-RC.1) (2023-10-25)

### Bug Fixes

- version of cancel notification api ([#1030](https://github.com/pagopa/pn-frontend/issues/1030)) ([bc52364](https://github.com/pagopa/pn-frontend/commit/bc523641c9ff468aab0ca141936e536f7e6bd77f))

# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)

### Bug Fixes

- EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
- **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
- **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))
- **PN-8100:** fix links in footer for Società Trasparente and Modello 231 ([#1014](https://github.com/pagopa/pn-frontend/issues/1014)) ([26809e7](https://github.com/pagopa/pn-frontend/commit/26809e7f1a810f5b090a26b8be17060b44a197c1))
- **PN-8128:** fixed copy destinatario sezione recapiti box recapito legale ([#1015](https://github.com/pagopa/pn-frontend/issues/1015)) ([07b07cf](https://github.com/pagopa/pn-frontend/commit/07b07cf2458a54f0cd4f7a3bdce5c0cba14bf10a))

### Features

- **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
- **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
- **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
- **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
- **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
- **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
- **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([d838cf4](https://github.com/pagopa/pn-frontend/commit/d838cf416b8763a7c573f6ece10c1b363301f4de))
- **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
- **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))

## [2.0.2](https://github.com/pagopa/pn-frontend/compare/v2.0.2-RC.0...v2.0.2) (2023-10-02)

## [2.0.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.0.2-RC.0) (2023-10-02)

### Bug Fixes

- **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
- **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))

### Features

- **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
- **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))

# [2.2.0](https://github.com/pagopa/pn-frontend/compare/v2.2.0-RC.2...v2.2.0) (2023-11-16)

**Note:** Version bump only for package send-monorepo

# [2.2.0-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.2.0-RC.0) (2023-10-24)

### Bug Fixes

- EmptyState button font style ([#1027](https://github.com/pagopa/pn-frontend/issues/1027)) ([898361f](https://github.com/pagopa/pn-frontend/commit/898361f0edd75263b817dabed30c1d28d2b66d86))
- **pn-7637:** fix copy paste duplication ([#1018](https://github.com/pagopa/pn-frontend/issues/1018)) ([d0a90e8](https://github.com/pagopa/pn-frontend/commit/d0a90e868265cfe79b5ad9619c7d40508b3693a3))
- **pn-8056:** used Trans component to show bold text in Api Keys's modals ([#1006](https://github.com/pagopa/pn-frontend/issues/1006)) ([2b82ee0](https://github.com/pagopa/pn-frontend/commit/2b82ee088e52da2feef0f07cafdd7d20430ca58e))
- **PN-8100:** fix links in footer for Società Trasparente and Modello 231 ([#1014](https://github.com/pagopa/pn-frontend/issues/1014)) ([26809e7](https://github.com/pagopa/pn-frontend/commit/26809e7f1a810f5b090a26b8be17060b44a197c1))
- **PN-8128:** fixed copy destinatario sezione recapiti box recapito legale ([#1015](https://github.com/pagopa/pn-frontend/issues/1015)) ([07b07cf](https://github.com/pagopa/pn-frontend/commit/07b07cf2458a54f0cd4f7a3bdce5c0cba14bf10a))
- **PN-7637:** trim values to be pasted as IUN or tax id for notification filter ([#993](https://github.com/pagopa/pn-frontend/issues/993)) ([6bd0ac2](https://github.com/pagopa/pn-frontend/commit/6bd0ac285df3f9ef84c212c32d3a912c5efdac69))
- **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))

### Features

- **pn-4392:** added switch institutions and products to PA ([#1020](https://github.com/pagopa/pn-frontend/issues/1020)) ([4d3f23e](https://github.com/pagopa/pn-frontend/commit/4d3f23ed841238910ab9590f10b4c5153454be84))
- **pn-7317:** Multipagamento, pagamento di notifica annullata ([#1017](https://github.com/pagopa/pn-frontend/issues/1017)) ([d9d2f27](https://github.com/pagopa/pn-frontend/commit/d9d2f27727cb5a6ed10194c8abb848c847b17aa5)), closes [#932](https://github.com/pagopa/pn-frontend/issues/932) [#933](https://github.com/pagopa/pn-frontend/issues/933) [#937](https://github.com/pagopa/pn-frontend/issues/937) [#939](https://github.com/pagopa/pn-frontend/issues/939) [#941](https://github.com/pagopa/pn-frontend/issues/941) [#944](https://github.com/pagopa/pn-frontend/issues/944) [#954](https://github.com/pagopa/pn-frontend/issues/954) [#956](https://github.com/pagopa/pn-frontend/issues/956) [#957](https://github.com/pagopa/pn-frontend/issues/957) [#952](https://github.com/pagopa/pn-frontend/issues/952) [#968](https://github.com/pagopa/pn-frontend/issues/968) [#966](https://github.com/pagopa/pn-frontend/issues/966) [#969](https://github.com/pagopa/pn-frontend/issues/969) [#970](https://github.com/pagopa/pn-frontend/issues/970) [#940](https://github.com/pagopa/pn-frontend/issues/940) [#973](https://github.com/pagopa/pn-frontend/issues/973) [#971](https://github.com/pagopa/pn-frontend/issues/971) [#958](https://github.com/pagopa/pn-frontend/issues/958) [#961](https://github.com/pagopa/pn-frontend/issues/961)
- **Pn-7410:** new translations including notification canceling and multipayment ([#1021](https://github.com/pagopa/pn-frontend/issues/1021)) ([54e1396](https://github.com/pagopa/pn-frontend/commit/54e1396db701526d2f02d425522f352da5c9ce37))
- **pn-8027:** reworked empty state ([#1004](https://github.com/pagopa/pn-frontend/issues/1004)) ([0ca180c](https://github.com/pagopa/pn-frontend/commit/0ca180cad6afbeccb85013f3452884ee14f7424a))
- **pn-8129:** deleted the config.json files for those obsolete environments ([#1016](https://github.com/pagopa/pn-frontend/issues/1016)) ([c291ddd](https://github.com/pagopa/pn-frontend/commit/c291dddc250df0e2ee6eed19eed1ced7793f0b49))
- **pn-8243:** FAQ on multi-payment notification ([#1019](https://github.com/pagopa/pn-frontend/issues/1019)) ([98f12e3](https://github.com/pagopa/pn-frontend/commit/98f12e3d064d5bb70b99d541352ac07344596461))
- **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([d838cf4](https://github.com/pagopa/pn-frontend/commit/d838cf416b8763a7c573f6ece10c1b363301f4de))
- **PN-8368:** configurated apikey api link in PA in config.json ([#1025](https://github.com/pagopa/pn-frontend/issues/1025)) ([e8c3848](https://github.com/pagopa/pn-frontend/commit/e8c384843663d5b858479b9ed43f98ce5e05d4f9))
- **pn-8376:** added senderDenomination concatenation when creating a new notification ([#1028](https://github.com/pagopa/pn-frontend/issues/1028)) ([ad68185](https://github.com/pagopa/pn-frontend/commit/ad68185a42593aeab9cd445e4cd2872ee3e383bb))
- **pn-7487:** Refactored pn-commons tests ([#974](https://github.com/pagopa/pn-frontend/issues/974)) ([9104b3b](https://github.com/pagopa/pn-frontend/commit/9104b3b0640abd7ca2cfc45127973feda7e7a69e))
- **pn-7747:** restructured project folders and files ([#994](https://github.com/pagopa/pn-frontend/issues/994)) ([84019fc](https://github.com/pagopa/pn-frontend/commit/84019fc476b053b72d284a6733cd6a5b581ec48f))

## [2.1.4](https://github.com/pagopa/pn-frontend/compare/v2.1.3...v2.1.4) (2023-11-20)

### Bug Fixes

- fix correct mixpanel utility, removed old one ([cd83106](https://github.com/pagopa/pn-frontend/commit/cd831063da0cca6352da04d79f4c870896537259))

## [2.1.3](https://github.com/pagopa/pn-frontend/compare/v2.1.2...v2.1.3) (2023-11-17)

### Bug Fixes

- added mixpanel property to blacklist ([41093d0](https://github.com/pagopa/pn-frontend/commit/41093d07dbdf9a428d167d9fd237786b826c4c2d))

## [2.1.2](https://github.com/pagopa/pn-frontend/compare/v2.1.1...v2.1.2) (2023-11-08)

### Bug Fixes

- intesigroup idp data and added relaystate ([85c2e37](https://github.com/pagopa/pn-frontend/commit/85c2e37837ea5389ff75f08928df4effd2a1b8c3))

### Features

- **pn-8255:** Added new IDPS Intesi Group S.p.A ([#1024](https://github.com/pagopa/pn-frontend/issues/1024)) ([f22cf57](https://github.com/pagopa/pn-frontend/commit/f22cf57e8c9a46fc6a90234bef5d498a01cb841c))

## [2.1.1](https://github.com/pagopa/pn-frontend/compare/v2.1.0...v2.1.1) (2023-10-19)

### Bug Fixes

- **PN-8290:** modified api b2b link ([f756e48](https://github.com/pagopa/pn-frontend/commit/f756e483f0411f6fa1aba2e51ff16270a5a19cf0))

# [2.1.0](https://github.com/pagopa/pn-frontend/compare/v2.1.0-RC.5...v2.1.0) (2023-09-28)

**Note:** Version bump only for package send-monorepo

## [2.0.2](https://github.com/pagopa/pn-frontend/compare/v2.0.2-RC.0...v2.0.2) (2023-10-02)

## [2.0.2-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.1...v2.0.2-RC.0) (2023-10-02)

### Bug Fixes

- **pn-8099:** avoid popup block on ios opening the attachment on the same window ([#1005](https://github.com/pagopa/pn-frontend/issues/1005)) ([73718ba](https://github.com/pagopa/pn-frontend/commit/73718ba9e10825073f6943952ff44f29b7866227))

## [2.0.1-RC.4](https://github.com/pagopa/pn-frontend/compare/v2.0.1-RC.3...v2.0.1-RC.4) (2023-07-31)

### Bug Fixes

- **pn-6134:** removed css override on paper component ([#921](https://github.com/pagopa/pn-frontend/issues/921)) ([cd3be7c](https://github.com/pagopa/pn-frontend/commit/cd3be7cb8316ef13b7e455a2cdea484d828f6764))
- **pn-6720:** fixed inline link of digital contacts code verification modal ([#922](https://github.com/pagopa/pn-frontend/issues/922)) ([1738524](https://github.com/pagopa/pn-frontend/commit/1738524d779b1151d0fcdcd42c1f10899b3fa13e))
- **pn-6724:** columns size in delegators list ([#917](https://github.com/pagopa/pn-frontend/issues/917)) ([cbac32a](https://github.com/pagopa/pn-frontend/commit/cbac32a4a5f6e1a3593c6341f9a666c087ac1a1e))
- **pn-6728:** alignment of chip in AppStatus ([#918](https://github.com/pagopa/pn-frontend/issues/918)) ([b0cdd7c](https://github.com/pagopa/pn-frontend/commit/b0cdd7c645085fa510a5296e15c177667eafb746))
- **pn-7078:** prevent index.html caching to avoid MIME type error ([#924](https://github.com/pagopa/pn-frontend/issues/924)) ([d52814c](https://github.com/pagopa/pn-frontend/commit/d52814c6c9397a1fad3fe0ad05e7908a191cc6f2))
- **pn-7120:** mobile filter dialog closes even if filters are invalid ([#914](https://github.com/pagopa/pn-frontend/issues/914)) ([299c8f7](https://github.com/pagopa/pn-frontend/commit/299c8f7dd2c244be30679dc146ff79cb77fa4685))
- **pn-7124:** fixed UI of the api-keys dialogs ([#923](https://github.com/pagopa/pn-frontend/issues/923)) ([5c3f759](https://github.com/pagopa/pn-frontend/commit/5c3f759db66502dd03b19c393baa8e58579c49de))
- **pn-7126:** accessibility of AppStatus page ([#915](https://github.com/pagopa/pn-frontend/issues/915)) ([77f2f37](https://github.com/pagopa/pn-frontend/commit/77f2f372a0f3483c8dbad6ee94143692e2267b4a))
- **pn-7195:** added pnpg path to csp ([#920](https://github.com/pagopa/pn-frontend/issues/920)) ([6bbedaa](https://github.com/pagopa/pn-frontend/commit/6bbedaa21b54720d61144d5cc2baaea3af12a69a))
- **pn-7211:** added pagination for api-keys list ([#926](https://github.com/pagopa/pn-frontend/issues/926)) ([928e732](https://github.com/pagopa/pn-frontend/commit/928e732abde8074acf0f946354b1068a066627cc))

### Features

- **pn-4267:** removed Cypress from webapps ([#919](https://github.com/pagopa/pn-frontend/issues/919)) ([1e1d4b5](https://github.com/pagopa/pn-frontend/commit/1e1d4b506a3d1328d697ab23a217107caf21beb4))
- **pn-6205:** added localization for others languages ([#916](https://github.com/pagopa/pn-frontend/issues/916)) ([dc8ae08](https://github.com/pagopa/pn-frontend/commit/dc8ae08458fc6adb3fc69d3876ead3ee16e2158d))

## [2.0.1-RC.0](https://github.com/pagopa/pn-frontend/compare/v2.0.0-RC.6...v2.0.1-RC.0) (2023-07-05)

### Bug Fixes

- **pn-6114:** removed trailing slash in prod config ([#886](https://github.com/pagopa/pn-frontend/issues/886)) ([bad786b](https://github.com/pagopa/pn-frontend/commit/bad786b6127829ad043a75237fb9fcd556b2f89c))
- **pn-6780:** fix collide tab in deleghe ([#842](https://github.com/pagopa/pn-frontend/issues/842)) ([414105b](https://github.com/pagopa/pn-frontend/commit/414105b0e3590d59ec3e3e5bb21fb36be8d2d0ce))
- **pn-6969:** add a11y ([#858](https://github.com/pagopa/pn-frontend/issues/858)) ([2b6e071](https://github.com/pagopa/pn-frontend/commit/2b6e0715016f8a58e25aa56dea1596075e847fc8))
- **pn-6970:** a11y of landing page ([#867](https://github.com/pagopa/pn-frontend/issues/867)) ([a345b3f](https://github.com/pagopa/pn-frontend/commit/a345b3f56cb28f0a5c8805f93ab5e0f00bc33489))
- **pn-6971:** fix a11y in emptystate ([#861](https://github.com/pagopa/pn-frontend/issues/861)) ([f75f8a3](https://github.com/pagopa/pn-frontend/commit/f75f8a38dff8202444af52820ec24e7e8a984f41))
- **pn-7042:** validation mode of notifications filter ([#884](https://github.com/pagopa/pn-frontend/issues/884)) ([5d51671](https://github.com/pagopa/pn-frontend/commit/5d516713b3b4d368fd1810a080647ac628d954fb))
- **pn-7063:** date in new delegation clears when user deletes the content ([#882](https://github.com/pagopa/pn-frontend/issues/882)) ([9c39215](https://github.com/pagopa/pn-frontend/commit/9c3921583bfba2d7dff77307134d4fe2455e7b81))

### Features

- **pn-6792:** analog progress event PNALL001 ([#872](https://github.com/pagopa/pn-frontend/issues/872)) ([fbf14bb](https://github.com/pagopa/pn-frontend/commit/fbf14bb2ca625d49ab72d844af1c72bcfaf842ff))
- **pn-6828:** allowed particular accessibility link for one URL pattern / disabled languages other than Italian ([#877](https://github.com/pagopa/pn-frontend/issues/877)) ([d6e5249](https://github.com/pagopa/pn-frontend/commit/d6e524909aca4b85c275254989ce7531dadde4c9))

### Reverts

- Revert "fix: add shadow in switch of TOS" ([aaeded8](https://github.com/pagopa/pn-frontend/commit/aaeded845ebb45824a696f7f9e7f56b348a10097))

## [1.5.4](https://github.com/pagopa/pn-frontend/compare/v1.5.3...v1.5.4) (2022-12-23)

### Bug Fixes

- **PN-2921:** generated and added test script for cookie management in pa-webapp ([b6cb71c](https://github.com/pagopa/pn-frontend/commit/b6cb71c8bde21eb53ae5d4f5be089c8141433a95))
- **PN-3034:** updated handbook link ([9d47cff](https://github.com/pagopa/pn-frontend/commit/9d47cffa451aaf3da73edf86e7a2242abdeda2c5))
- **pn-3046:** error message for denomination in manual send page ([#527](https://github.com/pagopa/pn-frontend/issues/527)) ([374c221](https://github.com/pagopa/pn-frontend/commit/374c2215a51be4c3e7b0e66b6a4613b11730deb6))

### Features

- **PN-1789:** exclusion for test files for coverage analysis ([80b3f60](https://github.com/pagopa/pn-frontend/commit/80b3f60ba3d7c28dc25f57a554b986278967025b))
- **pn-1789:** sonar setup for coverage analysis ([#507](https://github.com/pagopa/pn-frontend/issues/507)) ([fdb6c82](https://github.com/pagopa/pn-frontend/commit/fdb6c82f6dc21cbf815041ab0bea470401ecef3d))
- **pn-2981:** delete pageSize greater than 50 ([#525](https://github.com/pagopa/pn-frontend/issues/525)) ([415ad73](https://github.com/pagopa/pn-frontend/commit/415ad73af1ed17fcd366f20196d13f0ad1078ec4))

## [1.5.3](https://github.com/pagopa/pn-frontend/compare/v1.5.2...v1.5.3) (2022-12-14)

### Bug Fixes

- **pn-2826:** New notification - lost payment document infos after back action ([#489](https://github.com/pagopa/pn-frontend/issues/489)) ([6c92929](https://github.com/pagopa/pn-frontend/commit/6c929297e30b4c66b091623ab9acd28d55857e3a))
- **pn-2838:** special chars sanitized during translation ([#490](https://github.com/pagopa/pn-frontend/issues/490)) ([13ca14a](https://github.com/pagopa/pn-frontend/commit/13ca14aad46ef556699e2a049995e2e8eb70ddd6))
- **pn-2838:** updated tsconfig to manage dom manipulation ([#502](https://github.com/pagopa/pn-frontend/issues/502)) ([ff54c3d](https://github.com/pagopa/pn-frontend/commit/ff54c3d0a01bb6360106e50629324c97f63bd9e5))
- **pn-2852:** allign recipients denomination regexps to BE ([#506](https://github.com/pagopa/pn-frontend/issues/506)) ([935134f](https://github.com/pagopa/pn-frontend/commit/935134f714c31b0e63f3782af5cea54c7ba270d2))
- **PN-2855:** reset document ref when upload changes ([#503](https://github.com/pagopa/pn-frontend/issues/503)) ([75c027f](https://github.com/pagopa/pn-frontend/commit/75c027ff5b5f88050eb23a123371b0a6216159de))

### Features

- **pn-2198:** new notification - group required ([50a6ec9](https://github.com/pagopa/pn-frontend/commit/50a6ec961528ba7c1f8ed3785a4066e3c2955419))

## [1.5.2](https://github.com/pagopa/pn-frontend/compare/v1.5.1...v1.5.2) (2022-11-29)

### Bug Fixes

- add SPID_VALIDATOR_ENV_ENABLED in env.ts ([5791a4c](https://github.com/pagopa/pn-frontend/commit/5791a4c194af02b9b478f4af59645fa742ac14f9))
- add validator env variable for test ([0863d63](https://github.com/pagopa/pn-frontend/commit/0863d63604c14a718c0d83495f0794293fe25a9d))
- added sonar script in pn-commons ([2712e6a](https://github.com/pagopa/pn-frontend/commit/2712e6a521123968449ddb16433fb1404cc973c8))
- change validator icon ([981e389](https://github.com/pagopa/pn-frontend/commit/981e3896505fd5ee1babfcdb4edf7bd42cd55d36))
- **pn-2672:** format payment amount from eurocents to euros ([9ec5e8d](https://github.com/pagopa/pn-frontend/commit/9ec5e8d6ad97e610985da0c6b0321fe548a003b0))
- updated node version to 16 for landing codebuilder ([e5065e0](https://github.com/pagopa/pn-frontend/commit/e5065e009692fe8038174d541308dddf875238c7))
- updated sonar pipeline to check packages and not monorepo ([9ec3081](https://github.com/pagopa/pn-frontend/commit/9ec30812e2d8e65865b8fa845c4ef7e22ded0bc4))

### Features

- **pn-785:** added sonar scripts to all packages ([#480](https://github.com/pagopa/pn-frontend/issues/480)) ([56e7456](https://github.com/pagopa/pn-frontend/commit/56e7456929317759916bf88cd03d4a29cc8d513a))

## [1.5.1](https://github.com/pagopa/pn-frontend/compare/v1.5.0...v1.5.1) (2022-11-14)

### Bug Fixes

- **pn-2483:** Added denomination data to recipients list in notification detail ([9e63125](https://github.com/pagopa/pn-frontend/commit/9e63125ce188268d62fac5acf06de6a702cb35ac))
- **pn-2487:** adds multiple recipient with same notice code warning ([#457](https://github.com/pagopa/pn-frontend/issues/457)) ([8b39491](https://github.com/pagopa/pn-frontend/commit/8b3949100737f9ff664b6ec2c134a969e590dccd))
- **pn-2498:** legal fact not visible when timeline step is expanded ([5392aa2](https://github.com/pagopa/pn-frontend/commit/5392aa2a19076757e2151ab6de1e92ba069b3e33))
- **pn-2576:** add municipality to yup validation schema and set it to required for recipients on a new notification ([1c40245](https://github.com/pagopa/pn-frontend/commit/1c40245cbe90e948cbe8b07ae6a19bafcf877e4d))
- **pn-2577:** fix wrong data reset deleting an attachment or a payment file creating a new notification ([ac95e1c](https://github.com/pagopa/pn-frontend/commit/ac95e1cc8806a7ae9efe63a6af17f7462b2c2d90))
- **PN-2613:** Hide payment related fields after choosing "no payment" on a new notification ([#464](https://github.com/pagopa/pn-frontend/issues/464)) ([7263eee](https://github.com/pagopa/pn-frontend/commit/7263eeef70ccab9105db0718561d9969745c2b2f))

### Features

- **pn-2428:** added cypress for pa ([a968b24](https://github.com/pagopa/pn-frontend/commit/a968b2408de16fcd0a2d42fcbe55253bf535bb04))
- **pn-2488:** taxonomy code field in new notification page ([765c342](https://github.com/pagopa/pn-frontend/commit/765c34249955cfffd72c3e87b375f42cc6e1b2a8))
- **pn-785:** added sonar codebuilder ([#455](https://github.com/pagopa/pn-frontend/issues/455)) ([89185b5](https://github.com/pagopa/pn-frontend/commit/89185b55211f82b1b205fa3c905ec11ae5a1546d))

# [1.5.0](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.5.0) (2022-11-07)

### Bug Fixes

- fixed broken pagopa links ([7e06e34](https://github.com/pagopa/pn-frontend/commit/7e06e347408d825845a6d9b9d9751eaaed8de58e))
- fixed navigation back and forward Area Riservata ([bbd6206](https://github.com/pagopa/pn-frontend/commit/bbd6206f6988cec6a2c91f8c3471abb006253dc5))
- **PN-1789:** fixed coverage reports paths ([014aa1a](https://github.com/pagopa/pn-frontend/commit/014aa1a537f9357f7955a43ec1ea417b7af9cd1c))
- **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
- **pn-2204:** remove index.html ending from landing app links ([#440](https://github.com/pagopa/pn-frontend/issues/440)) ([faa5c23](https://github.com/pagopa/pn-frontend/commit/faa5c234bd542f79d4404f9880b411baf135a25d))
- **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
- **pn-2392:** differenziate tos acceptance page using mui-italia components ([ec8a3ab](https://github.com/pagopa/pn-frontend/commit/ec8a3ab643f31b79667f28161ef6b1610454dcfe))
- **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))
- **pn-2455:** modified copy text in login page. ([df02421](https://github.com/pagopa/pn-frontend/commit/df024216644a38911369163f239dae2f3ce202e3))
- **pn-2478:** change route NOTIFICA from notifica to dettaglio ([#451](https://github.com/pagopa/pn-frontend/issues/451)) ([7b93055](https://github.com/pagopa/pn-frontend/commit/7b930553660548e3c01332ff068a5c11cc65f6ef))

### Features

- **1285:** added onetrust scripts for production ([05cc91a](https://github.com/pagopa/pn-frontend/commit/05cc91aeab923457f593d56f0934e6a129648e0a))
- **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
- **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))
- **Pn 2501:** changed copy for Tos and privacy policy acceptance ([#452](https://github.com/pagopa/pn-frontend/issues/452)) ([5fc0608](https://github.com/pagopa/pn-frontend/commit/5fc06084de074e00246d18c14ff373f2e8ec9350))
- **pn-2138:** replaced loading spinner with skeleton to improve UX ([#438](https://github.com/pagopa/pn-frontend/issues/438)) ([a6f5766](https://github.com/pagopa/pn-frontend/commit/a6f576614865ba9015aedfb0307b1b5b2557999c))
- **pn-2261:** Handling failure in API calls to retrieve information, for pa-webapp ([339453a](https://github.com/pagopa/pn-frontend/commit/339453a13afb0666f2439344e42454670680a5cd))
- **pn-2298:** add tos guard ([c4b5a68](https://github.com/pagopa/pn-frontend/commit/c4b5a685bf5b366630e12e8038d74ecab5b619cc))
- **pn-2383:** notifications without payment ([#449](https://github.com/pagopa/pn-frontend/issues/449)) ([4658ca2](https://github.com/pagopa/pn-frontend/commit/4658ca2e4f7c22312691614fda557c293c887426))
- **pn-2398:** added build list item for hotfix environment ([46e36f1](https://github.com/pagopa/pn-frontend/commit/46e36f135da279e6709d82cec701674f2e8e73de))
- **pn-2410:** Translated README.md(s) and other documents in english ([a59de44](https://github.com/pagopa/pn-frontend/commit/a59de44d62b82cd60c8eaa75f2a4536aa8a6a0ae))
- **PN-2455:** added subtitle to login courtesy page ([c00759a](https://github.com/pagopa/pn-frontend/commit/c00759afb0218ab6b07c186edd25719ff815ae18))
- **pn-2460:** Edited regex for phone number ([8d8023e](https://github.com/pagopa/pn-frontend/commit/8d8023ef0d4e93ff89f1fb2eea61330c7e5af8dc))

## [1.4.2](https://github.com/pagopa/pn-frontend/compare/v1.4.1...v1.4.2) (2022-10-25)

### Bug Fixes

- **PN-1789:** fixed coverage reports paths ([014aa1a](https://github.com/pagopa/pn-frontend/commit/014aa1a537f9357f7955a43ec1ea417b7af9cd1c))
- **pn-2198:** added right validation rule for groups in manual sending ([a9d2240](https://github.com/pagopa/pn-frontend/commit/a9d2240c21131b038bff24b1735262150b8c301b))
- **pn-2204:** remove index.html ending from landing app links ([#440](https://github.com/pagopa/pn-frontend/issues/440)) ([faa5c23](https://github.com/pagopa/pn-frontend/commit/faa5c234bd542f79d4404f9880b411baf135a25d))
- **pn-2390:** enable filter button when only one date constraint is set ([250b6ec](https://github.com/pagopa/pn-frontend/commit/250b6ec6a7b8078ac66b25a8c68e3c2424857eec))
- **pn-2433:** fixed multiple api calls ([#439](https://github.com/pagopa/pn-frontend/issues/439)) ([0153651](https://github.com/pagopa/pn-frontend/commit/015365145bbd87ce7128acf3210c1d85622b3cb6))

### Features

- **2391:** refactoring footer links ([9fc71f5](https://github.com/pagopa/pn-frontend/commit/9fc71f5336848f8cd08ce22b373b2d25874f8300))
- **2394:** different pages for term of service and privacy ([a011dd7](https://github.com/pagopa/pn-frontend/commit/a011dd75d25f4615c9b304684c096d30c6518d82))

## [1.4.1](https://github.com/pagopa/pn-frontend/compare/v1.3.1...v1.4.1) (2022-10-18)

### Bug Fixes

- **pn-2048:** Hide legalfacts under macro status when timeline is expanded ([#410](https://github.com/pagopa/pn-frontend/issues/410)) ([7ea4434](https://github.com/pagopa/pn-frontend/commit/7ea4434ba1215349bb19abf636b0a7882c1ed725))
- **pn-2210:** spread token exchange response in User fields ([#415](https://github.com/pagopa/pn-frontend/issues/415)) ([2a014fc](https://github.com/pagopa/pn-frontend/commit/2a014fcb97e17c882d3fa05e4093d6ad4a79a078))
- **pn-2272:** enables attachments elimination in NewNotification page attachments section ([#419](https://github.com/pagopa/pn-frontend/issues/419)) ([e5b44ff](https://github.com/pagopa/pn-frontend/commit/e5b44ff3ec57bc8ad82991d28dbea11f2700c145))
- **PN-2281:** user should not access to contact page if tos are not accessed ([#417](https://github.com/pagopa/pn-frontend/issues/417)) ([5de1d43](https://github.com/pagopa/pn-frontend/commit/5de1d43c94989e80deae0db66c971e60a5817db3))
- **pn-2347:** substitute uploaded file ([#422](https://github.com/pagopa/pn-frontend/issues/422)) ([0d9be09](https://github.com/pagopa/pn-frontend/commit/0d9be0918175fd65a57ecf70f02742737d96f58d))
- removed cancelledIun as empty string ([cc58767](https://github.com/pagopa/pn-frontend/commit/cc58767141173d2e76f17e7e8b0f5dfa9b696c1b))

### Code Refactoring

- **PN-1994:** refactor VerifyUser e RequireAuth ([#400](https://github.com/pagopa/pn-frontend/issues/400)) ([50316d1](https://github.com/pagopa/pn-frontend/commit/50316d1ee17a6ebc732fa6774473bdf4db48d79a))

### Features

- **PN-1843:** rework notification sender page in order to make it navigable ([#350](https://github.com/pagopa/pn-frontend/issues/350)) ([67a96c8](https://github.com/pagopa/pn-frontend/commit/67a96c8129d1f0eb60feb5f392bd1ff7c52bdbfe))
- pn-1852 ottimizzare script mixpanel ([d1d7945](https://github.com/pagopa/pn-frontend/commit/d1d79455205a43c13dabaab9e4670339beed7967))
- pn-1942 gestione disservizio e informazioni corrette all'utente ([bc3918a](https://github.com/pagopa/pn-frontend/commit/bc3918a4c34a88fd8fdad9776e40313a85cd4dfe))
- **pn-2005:** Fluent Validation package ([#385](https://github.com/pagopa/pn-frontend/issues/385)) ([55f79d7](https://github.com/pagopa/pn-frontend/commit/55f79d71bfa86fc90ea6098630734fc9fb2a9400))
- **pn-2007:** update dependencies and move to devDependencies react-scripts p… ([#393](https://github.com/pagopa/pn-frontend/issues/393)) ([a28f16d](https://github.com/pagopa/pn-frontend/commit/a28f16d95ec08aac577204e666773aba0733a765))
- **Pn-2091:** enhanced dropdown usability ([#382](https://github.com/pagopa/pn-frontend/issues/382)) ([f639b02](https://github.com/pagopa/pn-frontend/commit/f639b0297d6128d87c6d6013e5f6d6c5db52ca25))
- **Pn-2125:** managing not functioning API for TOs in pa and pf ([#427](https://github.com/pagopa/pn-frontend/issues/427)) ([67897c4](https://github.com/pagopa/pn-frontend/commit/67897c44872d3495ff00a59d0b386ff3d2c9658b))
- **PN-2149:** certificate, CSP, DNS for prod environments ([#432](https://github.com/pagopa/pn-frontend/issues/432)) ([af48cf6](https://github.com/pagopa/pn-frontend/commit/af48cf6a416b94ae3620784c7493ee072beb4979))
- **pn-2247:** add PA privacy policy ([#413](https://github.com/pagopa/pn-frontend/issues/413)) ([30decda](https://github.com/pagopa/pn-frontend/commit/30decda962104aefc09ff08d58612950c4405ca1))
- **pn-2269:** validazione campi di input in invio manuale di una notifica ([7347e4a](https://github.com/pagopa/pn-frontend/commit/7347e4adccaaccf5f96fdf0f4c62a33d667975f2))

### BREAKING CHANGES

- **PN-1994:** this refactoring improves authentication and navigation management, but changes VerifyUser and RequireAuth names and API

- PN-1994 - SessionGuard + RouteGuard working in pf-webapp

- PN-1994 - hook per processo di inizializzazione in steps, aggiunto a pn-commons

- PN-1994 - SessionGuard e RouteGuard operativi in pa-webapp

- PN-1994 - aggiusto messaggio per pa-webapp (manca farlo in pf-webapp)

- PN-1994 - messaggi OK in SessionGuard in pf-webapp

- PN-1994 - pulsanti a AccessDenied

- PN-1994 - pa-webapp, va a AccessDenied in tutti gli accessi senza utente loggato, e non si vedono sidemenu e HeaderProduct

- PN-1994 - gestione utente non loggato in pf-webapp

- PN-1994 - tests degli nuovi componenti RouteGuard e SessionGuard, sia in pf-webapp che in pa-webapp

- PN-1994 - tests (adesso si ci sono)

- PN-1994 - pulizia mocks, componenti deprecati e console.log

- PN-1994 - ultimi aggiustamenti, versione pronta per review

- PN-1994 - ultimi-ultimi aggiustamenti, mo' la smetto davvero

- PN-1994 - modifiche per ridurre cognitive complexity - a meta

- PN-1994 - refactor in SessionGuard di pf-webapp in base a commenti di Carlotta ... eh si, manca farlo in pa-webapp, mi rendo conto solo adesso

- PN-1994 - replico in pa-webapp il refactor su SessionGuard fatto precedentemente in pf-webapp

- PN-1994 - piccolissimo miglioramento a useProcess

- chore: some copy, minimal refactoring and linting

- chore: some linting and some comments removed

- chore: some linting

Co-authored-by: Carlotta Dimatteo <carlotta.dimatteo@pagopa.it>

## [1.3.1](https://github.com/pagopa/pn-frontend/compare/v1.3.0...v1.3.1) (2022-09-27)

### Bug Fixes

- **pn-2164:** change copy for activate service banner ([#411](https://github.com/pagopa/pn-frontend/issues/411)) ([7fc83e7](https://github.com/pagopa/pn-frontend/commit/7fc83e788caeff90a47211c39201e5d411137445))
- **pn-2242:** add link to accessibility page ([#412](https://github.com/pagopa/pn-frontend/issues/412)) ([3e67199](https://github.com/pagopa/pn-frontend/commit/3e67199902c14536ef38d82ce75705c2bc12e9ff))
- **PN-2248:** added new eventcode to manage a KO in digitalprogress (timeline) ([c5ca9fe](https://github.com/pagopa/pn-frontend/commit/c5ca9fe18f545ab6f3e18d8413215071e1e0d2e1))

# [1.3.0](https://github.com/pagopa/pn-frontend/compare/v1.2.2...v1.3.0) (2022-09-23)

### Bug Fixes

- **pn-1368:** change mixpanel imports and target cookies ([#403](https://github.com/pagopa/pn-frontend/issues/403)) ([daf07e9](https://github.com/pagopa/pn-frontend/commit/daf07e98c8aef983b10813d56e6f1f671664aafc))
- **PN-2107:** fixed copy in timeline and some refactoring to reduce cognitive complex ([e776461](https://github.com/pagopa/pn-frontend/commit/e7764611ff769c7c7395472f82463047d44ff8a8))
- pn-2216 change tokenExchange from get to post ([4b75578](https://github.com/pagopa/pn-frontend/commit/4b7557818eece06eddb8b08bf76401c2bd575c4d))

### Features

- **Pn-1851:** cookie script ([#408](https://github.com/pagopa/pn-frontend/issues/408)) ([7c8021d](https://github.com/pagopa/pn-frontend/commit/7c8021d5fcc326bfb1d0a1a7ce8088e9538e5f8d))
- **PN-2145:** redirect to logout route when doing logout ([#396](https://github.com/pagopa/pn-frontend/issues/396)) ([6d5509a](https://github.com/pagopa/pn-frontend/commit/6d5509a9931f4aaa1463a5a70aa3d4e5435e5eab))
- pn-2195 bottone CIE nascosto ([d3322d8](https://github.com/pagopa/pn-frontend/commit/d3322d8355439df14ad3d8773a1bd0067c2fc9c7))
- **pn-2209:** add issue templates ([#404](https://github.com/pagopa/pn-frontend/issues/404)) ([97353c5](https://github.com/pagopa/pn-frontend/commit/97353c58211e2d472afcc65aa64dc574cd9ade5e))

## [1.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.2...v1.2.2) (2022-09-14)

### Bug Fixes

- **pn-2000:** added correct Tos file and hidden accessibility page ([1cf42c5](https://github.com/pagopa/pn-frontend/commit/1cf42c58c1c18041ccddd9af4347fd7204b957b3))

## [0.2.2](https://github.com/pagopa/pn-frontend/compare/v0.2.1...v0.2.2) (2022-09-13)

### Bug Fixes

- **PN-2170:** fixed social links in footer ([2276b30](https://github.com/pagopa/pn-frontend/commit/2276b307ec2893473502307d41ce78ca0dbfab8a))
- renamed Avviso di cortesia to notifiche digitali on website ([cbe5596](https://github.com/pagopa/pn-frontend/commit/cbe5596a50d662b3c44c48dad45b5a5f3dcbab8e))
- strange redirect to home page when reloading any page ([#397](https://github.com/pagopa/pn-frontend/issues/397)) ([be8cc59](https://github.com/pagopa/pn-frontend/commit/be8cc595adba3bfbb04e1a5338e54b2bea4efcee))

## [0.2.1](https://github.com/pagopa/pn-frontend/compare/v0.2.0...v0.2.1) (2022-09-12)

### Bug Fixes

- change http code for delegation creation errors (duplicated and self-delegation) ([#395](https://github.com/pagopa/pn-frontend/issues/395)) ([b6f0c61](https://github.com/pagopa/pn-frontend/commit/b6f0c61970a72e978b9f5f5b48fd21f79d7652b8))
- fixed new http code for verification code ([cc4914b](https://github.com/pagopa/pn-frontend/commit/cc4914bbef1bda62e245e70e8018262b4e1ec9c5))
- fixed rediret to portale-login in coll environment ([7974d25](https://github.com/pagopa/pn-frontend/commit/7974d2588176f92e028abaaa518fd6808b58d668))
- **pn-1700:** Modified text error title when verification code is wrong ([#390](https://github.com/pagopa/pn-frontend/issues/390)) ([acf3a02](https://github.com/pagopa/pn-frontend/commit/acf3a02957984d0dda7b2a8a8f5096e01e25f2ac))
- **PN-2000:** added preview env and removed PN-CTA for such environment ([bff15d9](https://github.com/pagopa/pn-frontend/commit/bff15d9a62ef3e271b65866d0f00e40624c41648))
- **PN-2000:** fix for navigation on cloudfront ([db7b016](https://github.com/pagopa/pn-frontend/commit/db7b0162f8f37b7b059a74b2a90c0fe6a9a88724))
- **PN-2000:** fix informativa-privacy and accessibilita links ([1c0ae35](https://github.com/pagopa/pn-frontend/commit/1c0ae35892fb74ee9628d041596b122d71509298))
- **pn-2000:** fix on footer links for pn-website ([c8622ee](https://github.com/pagopa/pn-frontend/commit/c8622eef1cf49cd1ae9920227c9b13464d2bb221))
- **pn-2146:** pn-website settare immagini e icon giuste ([#392](https://github.com/pagopa/pn-frontend/issues/392)) ([df9889f](https://github.com/pagopa/pn-frontend/commit/df9889fb1ce37dce20b60ebf11331cbcdb1665a9))
- **pn-2146:** setting images and icons ([#388](https://github.com/pagopa/pn-frontend/issues/388)) ([f61f1b5](https://github.com/pagopa/pn-frontend/commit/f61f1b5694467530b823c6f36ccc4586a0787f38))
- **PN-2153:** fix copy for enti ([bfcb5e7](https://github.com/pagopa/pn-frontend/commit/bfcb5e738a94651d5a694055f8382c130a03e105))

### Features

- **pn-1816:** Aggiunto certificato per sito landing tra le configurazioni ([#387](https://github.com/pagopa/pn-frontend/issues/387)) ([9692aca](https://github.com/pagopa/pn-frontend/commit/9692aca1a0a279815f8885e2800149165bf9cca2))

# [0.2.0](https://github.com/pagopa/pn-frontend/compare/v0.1.11...v0.2.0) (2022-09-06)

### Bug Fixes

- **PN-2107:** modified copy about timeline and sending manual notification ([#383](https://github.com/pagopa/pn-frontend/issues/383)) ([a4a5445](https://github.com/pagopa/pn-frontend/commit/a4a544501f8d43b037a94889b15d2fd9f598b3b0))

### Features

- **pn-1572:** landing ci cd ([#381](https://github.com/pagopa/pn-frontend/issues/381)) ([5ff7063](https://github.com/pagopa/pn-frontend/commit/5ff7063cc6ef2dce4b504ed70a57f4c78c255de5))
- **PN-1754:** implement relative path login (link di accesso rapido) ([#380](https://github.com/pagopa/pn-frontend/issues/380)) ([1cf7583](https://github.com/pagopa/pn-frontend/commit/1cf758304a7b5dc0d424c671d5cedfd424aa01e3))
- **pn-1754:** link qr email pec ([#384](https://github.com/pagopa/pn-frontend/issues/384)) ([e86b45b](https://github.com/pagopa/pn-frontend/commit/e86b45bfb818e3eac94b022481de894b3783afe5))
- **PN-2047:** particular handle of status 403 in the response of the exchangeToken BE call ([#372](https://github.com/pagopa/pn-frontend/issues/372)) ([a5fa5f2](https://github.com/pagopa/pn-frontend/commit/a5fa5f22519cbffdc2134e2b74af62779db43045))

## [0.1.11](https://github.com/pagopa/pn-frontend/compare/v0.1.10...v0.1.11) (2022-08-31)

### Bug Fixes

- changed PartyRole to PnRole to manage access for PA users ([9e43e5e](https://github.com/pagopa/pn-frontend/commit/9e43e5eb70aa74e8bdbc6f2e6443a9a9a64be292))
- fixed test on requireAuth component ([74aed26](https://github.com/pagopa/pn-frontend/commit/74aed26c9864e16cf9b5793b6c2a11d5abee4151))
- **pn-2103:** fixed strange loop in contacts page ([#378](https://github.com/pagopa/pn-frontend/issues/378)) ([1406fb4](https://github.com/pagopa/pn-frontend/commit/1406fb4e2c56c029052c3fde636952655a4dba8f))

## [0.1.10](https://github.com/pagopa/pn-frontend/compare/v0.1.9...v0.1.10) (2022-08-26)

### Bug Fixes

- pn-2068 timeline - visualizzazione stato "invio messaggio di cortesia" ([c3f8ca8](https://github.com/pagopa/pn-frontend/commit/c3f8ca897d09c8ade4ac143ac0e03e6f49ca1902))

### Features

- pn-1374 lista gruppi per creazione nuova notifica ([b99ea09](https://github.com/pagopa/pn-frontend/commit/b99ea09059fbcc1d4d3f5ff6f445cce5c26b1071))

## [0.1.9](https://github.com/pagopa/pn-frontend/compare/v0.1.8...v0.1.9) (2022-08-12)

### Bug Fixes

- **Pn-2013:** avoid identical taxId input in manual notification form ([#361](https://github.com/pagopa/pn-frontend/issues/361)) ([c0be535](https://github.com/pagopa/pn-frontend/commit/c0be535d7db6244980107bc64ea820f69b24492f))
- **pn-2052:** Fixed CSS alignment or legal facts in timeline ([#370](https://github.com/pagopa/pn-frontend/issues/370)) ([cfa48da](https://github.com/pagopa/pn-frontend/commit/cfa48dab951e40169c498087bcec1472524c1977))
- removed config from next.config ([b31be4b](https://github.com/pagopa/pn-frontend/commit/b31be4b277e1186ab1d990223bb1ee3bdf97e45b))
- trying to use middleware for redirects ([65fd334](https://github.com/pagopa/pn-frontend/commit/65fd334364cb4c882e271b226face054d997ea94))

### Features

- **PN-1948:** reducers refactoring ([#352](https://github.com/pagopa/pn-frontend/issues/352)) ([0194539](https://github.com/pagopa/pn-frontend/commit/019453949a6bbbc6270f615dac9c004fe2f92ce2))
- **PN-2030:** Added new page 'Dichiarazione Accessibilità' to landing webapp, replaced link in footer ([#371](https://github.com/pagopa/pn-frontend/issues/371)) ([5196998](https://github.com/pagopa/pn-frontend/commit/5196998a9b34bc8e0d39d0853ffb4220bce968d9))
- **PN-2030:** fixed dichiarazione di accessibilità path ([32b5fde](https://github.com/pagopa/pn-frontend/commit/32b5fde02e03fe03f4dcd3fa60d024889de4def8))
- trying to use middleware to redirect pages ([183a7bf](https://github.com/pagopa/pn-frontend/commit/183a7bf05308398f92c3b3ca14d54f61c1109f7a))

### Reverts

- Revert "chore: dependencies upgrade" ([b1f0e97](https://github.com/pagopa/pn-frontend/commit/b1f0e978129fa73fd1547269c1fb6d6e057d9509))

## [0.1.8](https://github.com/pagopa/pn-frontend/compare/v0.1.7...v0.1.8) (2022-08-10)

### Bug Fixes

- fixed wrong mapping in localization files ([6f790d5](https://github.com/pagopa/pn-frontend/commit/6f790d5ea9690f1ae6d7ebe519b74ae67d77d635))
- **PN-1835:** added FLAT_RATE as notificationFeePolicy ([1c3de05](https://github.com/pagopa/pn-frontend/commit/1c3de058fdb876a28bbdd7e106dc06909648ee00))
- **Pn-2026:** filters date are set after checkin notification detail ([#365](https://github.com/pagopa/pn-frontend/issues/365)) ([4154e56](https://github.com/pagopa/pn-frontend/commit/4154e56a2c68181d037b84aeb582d85d5d44e7be))
- **PN-2028:** Commented out code link and test for API-KEYS ([#366](https://github.com/pagopa/pn-frontend/issues/366)) ([347ccf8](https://github.com/pagopa/pn-frontend/commit/347ccf8984e521255d0458df220bd1b03b8e7d4e))
- **pn-2029:** Commented out code link to FAQ in payment section ([#367](https://github.com/pagopa/pn-frontend/issues/367)) ([51f5f3a](https://github.com/pagopa/pn-frontend/commit/51f5f3a05a9093c8111747b263752477a503c4bc))
- **pn-2044:** Added maxLength limit to 25 to iunMatch input in PA ([#368](https://github.com/pagopa/pn-frontend/issues/368)) ([e391390](https://github.com/pagopa/pn-frontend/commit/e3913906679fab42b332935e57d93627dfd15e2c))

### Features

- **PN-1947:** user validation in sessionStorage ([#360](https://github.com/pagopa/pn-frontend/issues/360)) ([6a2922c](https://github.com/pagopa/pn-frontend/commit/6a2922c0f442d8433e3fce049645a2bb99811d1f))

## [0.1.7](https://github.com/pagopa/pn-frontend/compare/v0.1.6...v0.1.7) (2022-08-09)

### Bug Fixes

- **pn-1984:** fixed expired session check for pf ([d8d0920](https://github.com/pagopa/pn-frontend/commit/d8d09208ca6c33ff97e50d68513cd2bcfb717202))
- **pn-2023:** issue related to indexes of documents values ([#362](https://github.com/pagopa/pn-frontend/issues/362)) ([56d93b1](https://github.com/pagopa/pn-frontend/commit/56d93b1f942c5a9103ed592cc8e555a43c3d89bd))

## [0.1.6](https://github.com/pagopa/pn-frontend/compare/v0.1.5...v0.1.6) (2022-08-05)

### Bug Fixes

- **PN-1988:** Changed method to open SPID login page ([#351](https://github.com/pagopa/pn-frontend/issues/351)) ([f729081](https://github.com/pagopa/pn-frontend/commit/f729081e377085a41b10b6449a8336c650f3e4e2))
- **PN-1989:** transient error page avoided if user cancels the login or other user-related situations ([#357](https://github.com/pagopa/pn-frontend/issues/357)) ([53a90f9](https://github.com/pagopa/pn-frontend/commit/53a90f9e434eb1279ae6fc830c2c6b94b0cd6420))

### Features

- pn-1702 url pagamento recuperato da be ([6891f2d](https://github.com/pagopa/pn-frontend/commit/6891f2dccf4e0ef5fd4c0174fb7a62ee80969e97))
- **pn-1926:** timeline new copy and new status ([#359](https://github.com/pagopa/pn-frontend/issues/359)) ([6f92d1c](https://github.com/pagopa/pn-frontend/commit/6f92d1cb94fc018fe4fee3a4076bfa0703f9682a))

### Reverts

- Revert "fix(PN-1988): Changed method to open SPID login page (#351)" (#353) ([1de5f9e](https://github.com/pagopa/pn-frontend/commit/1de5f9e78ef761aeb12aaec79a14dd7ec02d7a60)), closes [#351](https://github.com/pagopa/pn-frontend/issues/351) [#353](https://github.com/pagopa/pn-frontend/issues/353)

## [0.1.5](https://github.com/pagopa/pn-frontend/compare/v0.1.4...v0.1.5) (2022-08-03)

### Bug Fixes

- fixed path for onetrust folders ([9888380](https://github.com/pagopa/pn-frontend/commit/988838040a6d2b9d8da9d36dd9713d7857fa208e))
- pn 1923 legalfacts differentiation labels ([#343](https://github.com/pagopa/pn-frontend/issues/343)) ([8421679](https://github.com/pagopa/pn-frontend/commit/8421679ebb3981e40f741af8cc085b0f5d35c960))
- **PN-1984:** expired session handler([#349](https://github.com/pagopa/pn-frontend/issues/349)) ([314643e](https://github.com/pagopa/pn-frontend/commit/314643e5ae94c46da9871acca165bf109e0a28e6))
- **PN-1987:** fixed typo in recapiti locale ([31755af](https://github.com/pagopa/pn-frontend/commit/31755af658e48c9b811806b48326c9920005b520))

### Features

- **1908:** fixed path for .env file in pa portal ([69a7acc](https://github.com/pagopa/pn-frontend/commit/69a7acc6d034b145e0718fd9695b2fce55b1af17))
- **PN-1369:** removed some comments related to mixpanel init ([52dcf1e](https://github.com/pagopa/pn-frontend/commit/52dcf1e5ede186e55e1b7db13d4d3a18ed71be27))
- **PN-1369:** trying to instantiate mixpanel ([2eb2ace](https://github.com/pagopa/pn-frontend/commit/2eb2acec788f68f57b8ab1542268611586f5bf2e))
- pn-1850 nome ente da api ([02c262c](https://github.com/pagopa/pn-frontend/commit/02c262c6def6646c00e75e7f24f067d43129d0c7))
- **PN-1908:** added .env file to get package version ([654b291](https://github.com/pagopa/pn-frontend/commit/654b291f9591d47b171d28abb9aee58bffe8a5cf))

## [0.1.4](https://github.com/pagopa/pn-frontend/compare/v0.1.3...v0.1.4) (2022-08-01)

### Bug Fixes

- added a console error in empty catch ([f9023dd](https://github.com/pagopa/pn-frontend/commit/f9023ddc7ebf0cc5499322993b2d0fdb4f42a4e7))
- pn-1943 allow the user to access the application only if the ToS acceptance request is successfully sent ([#340](https://github.com/pagopa/pn-frontend/issues/340)) ([3b8614a](https://github.com/pagopa/pn-frontend/commit/3b8614a993c86083ce304197808bc951ab15ed9c))

### Features

- pn 1295 pn-commons internationalization ([#295](https://github.com/pagopa/pn-frontend/issues/295)) ([ab48285](https://github.com/pagopa/pn-frontend/commit/ab4828551601ad00d4307288cb7a57900d3c487d))
- pn 1631 change language ([#297](https://github.com/pagopa/pn-frontend/issues/297)) ([fe70df7](https://github.com/pagopa/pn-frontend/commit/fe70df7475715c6c11092405997db95b4cfe732b))
- pn 1779 lazy loading ([#341](https://github.com/pagopa/pn-frontend/issues/341)) ([00c51a0](https://github.com/pagopa/pn-frontend/commit/00c51a083619a1648b372552179cb4e3252100e6))
- pn 1908 release version in code and reachable from running app ([#344](https://github.com/pagopa/pn-frontend/issues/344)) ([eb6cd3a](https://github.com/pagopa/pn-frontend/commit/eb6cd3a662974f9a85407b4c6a9714c2e9350fe3))
- pn 969 internationalization for sender app ([#330](https://github.com/pagopa/pn-frontend/issues/330)) ([9a7b62c](https://github.com/pagopa/pn-frontend/commit/9a7b62c2aa82ebbea69c1927547a7cb296268c50))
- pn-1558 chiamata ad api lista enti solo quando necessario ([c895249](https://github.com/pagopa/pn-frontend/commit/c895249837b66084c282b858e07fb267b23a8454))
- pn-1777 suddivisione pn-commons ([8e0f409](https://github.com/pagopa/pn-frontend/commit/8e0f409843a501b00c048520c06e71183d1e37ca))
- pn-1904 personafisica-login - usato componente Layout di pn-commons ([68efaac](https://github.com/pagopa/pn-frontend/commit/68efaac1bd08d9fdf81cc7f57df9cedba237c4a1))
