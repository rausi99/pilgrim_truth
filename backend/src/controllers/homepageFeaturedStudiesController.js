const pool = require("../config/db");

/**
 * Get all published Bible Studies available
 * for homepage selection.
 */
const getAvailableFeaturedStudies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        bs.id,
        bs.title,
        bs.slug,
        bs.category,
        bs.description,
        bs.scripture_reference,
        bs.featured_image,
        bs.status,
        bs.published_at,

        COALESCE(
          hfs.display_order,
          9999
        ) AS display_order,

        CASE
          WHEN hfs.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS featured

      FROM bible_studies bs

      LEFT JOIN homepage_featured_studies hfs
        ON hfs.bible_study_id = bs.id

      WHERE LOWER(bs.status) = 'published'

      ORDER BY
        CASE
          WHEN hfs.id IS NOT NULL THEN 0
          ELSE 1
        END,

        COALESCE(
          hfs.display_order,
          9999
        ),

        bs.published_at DESC NULLS LAST,
        bs.id DESC
    `);

    return res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error(
      "Get available homepage featured studies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load homepage featured studies.",
    });
  }
};


/**
 * Get currently selected homepage
 * featured Bible Studies.
 */
const getFeaturedStudies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        hfs.id,
        hfs.bible_study_id,
        hfs.display_order,

        bs.title,
        bs.slug,
        bs.category,
        bs.description,
        bs.scripture_reference,
        bs.featured_image,
        bs.published_at

      FROM homepage_featured_studies hfs

      INNER JOIN bible_studies bs
        ON bs.id = hfs.bible_study_id

      WHERE LOWER(bs.status) = 'published'

      ORDER BY
        hfs.display_order ASC,
        hfs.id ASC
    `);

    return res.json({
      success: true,
      studies: result.rows,
    });
  } catch (error) {
    console.error(
      "Get homepage featured studies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load featured studies.",
    });
  }
};


/**
 * Update homepage featured studies.
 *
 * Maximum of 3 studies.
 */
const updateFeaturedStudies = async (req, res) => {
  const client = await pool.connect();

  try {
    const { studies } = req.body;

    if (!Array.isArray(studies)) {
      return res.status(400).json({
        success: false,
        message:
          "Studies must be provided as an array.",
      });
    }

    if (studies.length > 3) {
      return res.status(400).json({
        success: false,
        message:
          "You can feature a maximum of three Bible Studies.",
      });
    }

    const normalizedStudies = studies
      .map((study, index) => ({
        bible_study_id: Number(
          study?.bible_study_id
        ),

        display_order:
          Number(study?.display_order) ||
          index + 1,
      }))
      .filter(
        (study) =>
          Number.isInteger(
            study.bible_study_id
          ) &&
          study.bible_study_id > 0
      );

    const studyIds = normalizedStudies.map(
      (study) => study.bible_study_id
    );

    /**
     * Prevent duplicate selections.
     */
    if (
      new Set(studyIds).size !==
      studyIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A Bible Study cannot be selected more than once.",
      });
    }

    await client.query("BEGIN");

    /**
     * Verify that all selected studies:
     *
     * 1. Exist
     * 2. Are published
     */
    if (studyIds.length > 0) {
      const validation =
        await client.query(
          `
          SELECT id
          FROM bible_studies
          WHERE id = ANY($1::INTEGER[])
            AND LOWER(status) = 'published'
          `,
          [studyIds]
        );

      if (
        validation.rows.length !==
        studyIds.length
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          success: false,
          message:
            "One or more selected Bible Studies are not published or do not exist.",
        });
      }
    }

    /**
     * Replace the existing homepage
     * selection.
     */
    await client.query(
      "DELETE FROM homepage_featured_studies"
    );

    /**
     * Insert the new selection
     * in the requested order.
     */
    for (
      let index = 0;
      index < normalizedStudies.length;
      index++
    ) {
      const study =
        normalizedStudies[index];

      await client.query(
        `
        INSERT INTO homepage_featured_studies (
          bible_study_id,
          display_order
        )
        VALUES ($1, $2)
        `,
        [
          study.bible_study_id,
          index + 1,
        ]
      );
    }

    await client.query("COMMIT");

    /**
     * Return the updated selection.
     */
    const result = await client.query(`
      SELECT
        hfs.id,
        hfs.bible_study_id,
        hfs.display_order,

        bs.title,
        bs.slug,
        bs.category,
        bs.description,
        bs.scripture_reference,
        bs.featured_image,
        bs.published_at

      FROM homepage_featured_studies hfs

      INNER JOIN bible_studies bs
        ON bs.id = hfs.bible_study_id

      WHERE LOWER(bs.status) = 'published'

      ORDER BY
        hfs.display_order ASC,
        hfs.id ASC
    `);

    return res.json({
      success: true,
      message:
        "Homepage featured studies updated successfully.",
      studies: result.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update homepage featured studies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update homepage featured studies.",
    });
  } finally {
    client.release();
  }
};


module.exports = {
  getAvailableFeaturedStudies,
  getFeaturedStudies,
  updateFeaturedStudies,
};
