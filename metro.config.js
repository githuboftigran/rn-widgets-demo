// @flow
//  Created by tigransahakyan on 2019-07-07.
//  Copyright © 2019 Quicken Inc. All rights reserved.

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};