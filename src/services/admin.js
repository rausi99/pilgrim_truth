const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// =========================================================
// DASHBOARD
// =========================================================

export async function getDashboardStats(token) {
  const response = await fetch(
    `${API_URL}/admin/dashboard`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load dashboard statistics."
    );
  }

  return data;
}


// =========================================================
// GET ALL ARTICLES
// =========================================================

export async function getAdminArticles(token) {
  const response = await fetch(
    `${API_URL}/content/articles`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load articles."
    );
  }

  return data;
}


// =========================================================
// GET SINGLE ARTICLE
// =========================================================

export async function getAdminArticle(
  token,
  articleId
) {
  const response = await fetch(
    `${API_URL}/content/articles/${articleId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load article."
    );
  }

  return data;
}


// =========================================================
// CREATE ARTICLE
// =========================================================

export async function createAdminArticle(
  token,
  articleData
) {
  const response = await fetch(
    `${API_URL}/content/articles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create article."
    );
  }

  return data;
}


// =========================================================
// ADMIN IMAGE UPLOAD
// =========================================================

export async function uploadAdminImage(
  token,
  imageFile
) {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await fetch(
    `${API_URL}/content/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to upload image."
    );
  }

  return data;
}

// =========================================================
// UPDATE ARTICLE
// =========================================================

export async function updateAdminArticle(
  token,
  articleId,
  articleData
) {
  const response = await fetch(
    `${API_URL}/content/articles/${articleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update article."
    );
  }

  return data;
}

export async function deleteAdminArticle(
  token,
  articleId
) {
  const response = await fetch(
    `${API_URL}/content/articles/${articleId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete article."
    );
  }

  return data;
}

export async function getAdminDailyInspirations(token) {
  const response = await fetch(
    `${API_URL}/content/daily-inspirations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load Daily Inspirations."
    );
  }

  return data;
}


export async function createAdminDailyInspiration(
  token,
  inspirationData
) {
  const response = await fetch(
    `${API_URL}/content/daily-inspirations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inspirationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create Daily Inspiration."
    );
  }

  return data;
}


export async function updateAdminDailyInspiration(
  token,
  inspirationId,
  inspirationData
) {
  const response = await fetch(
    `${API_URL}/content/daily-inspirations/${inspirationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inspirationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update Daily Inspiration."
    );
  }

  return data;
}


export async function deleteAdminDailyInspiration(
  token,
  inspirationId
) {
  const response = await fetch(
    `${API_URL}/content/daily-inspirations/${inspirationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete Daily Inspiration."
    );
  }

  return data;
}
export async function getAdminBibleStudies(token) {
  const response = await fetch(
    `${API_URL}/content/bible-studies`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load Bible Studies."
    );
  }

  return data;
}


export async function getAdminBibleStudy(
  token,
  studyId
) {
  const response = await fetch(
    `${API_URL}/content/bible-studies/${studyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load Bible Study."
    );
  }

  return data;
}


export async function createAdminBibleStudy(
  token,
  studyData
) {
  const response = await fetch(
    `${API_URL}/content/bible-studies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create Bible Study."
    );
  }

  return data;
}


export async function updateAdminBibleStudy(
  token,
  studyId,
  studyData
) {
  const response = await fetch(
    `${API_URL}/content/bible-studies/${studyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update Bible Study."
    );
  }

  return data;
}


export async function deleteAdminBibleStudy(
  token,
  studyId
) {
  const response = await fetch(
    `${API_URL}/content/bible-studies/${studyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete Bible Study."
    );
  }

  return data;
}

// =========================
// PROPHECY
// =========================

export async function getAdminProphecies(token) {
  const response = await fetch(
    `${API_URL}/content/prophecies`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load prophecies."
    );
  }

  return data;
}


export async function getAdminProphecy(
  token,
  prophecyId
) {
  const response = await fetch(
    `${API_URL}/content/prophecies/${prophecyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load prophecy."
    );
  }

  return data;
}


export async function createAdminProphecy(
  token,
  prophecyData
) {
  const response = await fetch(
    `${API_URL}/content/prophecies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prophecyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create prophecy."
    );
  }

  return data;
}


export async function updateAdminProphecy(
  token,
  prophecyId,
  prophecyData
) {
  const response = await fetch(
    `${API_URL}/content/prophecies/${prophecyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prophecyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update prophecy."
    );
  }

  return data;
}


export async function deleteAdminProphecy(
  token,
  prophecyId
) {
  const response = await fetch(
    `${API_URL}/content/prophecies/${prophecyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete prophecy."
    );
  }

  return data;
}

// =========================================================
// ADMIN VIDEOS
// =========================================================

export async function getAdminVideos(token) {
  const response = await fetch(
    `${API_URL}/content/videos`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load videos."
    );
  }

  return data;
}


export async function getAdminVideo(
  token,
  videoId
) {
  const response = await fetch(
    `${API_URL}/content/videos/${videoId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load video."
    );
  }

  return data;
}


export async function createAdminVideo(
  token,
  videoData
) {
  const response = await fetch(
    `${API_URL}/content/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(videoData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create video."
    );
  }

  return data;
}


export async function updateAdminVideo(
  token,
  videoId,
  videoData
) {
  const response = await fetch(
    `${API_URL}/content/videos/${videoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(videoData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update video."
    );
  }

  return data;
}


export async function deleteAdminVideo(
  token,
  videoId
) {
  const response = await fetch(
    `${API_URL}/content/videos/${videoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete video."
    );
  }

  return data;
}

// =========================================================
// YOUTUBE METADATA
// =========================================================

export async function getYouTubeMetadata(
  token,
  youtubeUrl
) {
  const response = await fetch(
    `${API_URL}/content/youtube-metadata?url=${encodeURIComponent(
      youtubeUrl
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to retrieve YouTube metadata."
    );
  }

  return data;
}

// =========================================================
// RESOURCES
// =========================================================

export async function getAdminResources(token) {
  const response = await fetch(
    `${API_URL}/content/resources`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load resources."
    );
  }

  return data;
}

export async function getAdminResource(
  token,
  resourceId
) {
  const response = await fetch(
    `${API_URL}/content/resources/${resourceId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load resource."
    );
  }

  return data;
}

export async function createAdminResource(
  token,
  resourceData
) {
  const response = await fetch(
    `${API_URL}/content/resources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create resource."
    );
  }

  return data;
}

export async function updateAdminResource(
  token,
  resourceId,
  resourceData
) {
  const response = await fetch(
    `${API_URL}/content/resources/${resourceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resourceData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update resource."
    );
  }

  return data;
}

export async function deleteAdminResource(
  token,
  resourceId
) {
  const response = await fetch(
    `${API_URL}/content/resources/${resourceId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete resource."
    );
  }

  return data;
}

export async function getAdminDiscussions(token) {
  const response = await fetch(`${API_URL}/admin/discussions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussions."
    );
  }

  return data;
}

export async function getAdminDiscussion(token, discussionId) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussion."
    );
  }

  return data;
}

export async function toggleAdminDiscussionFeatured(
  token,
  discussionId
) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}/feature`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update featured status."
    );
  }

  return data;
}

export async function toggleAdminDiscussionLocked(
  token,
  discussionId
) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}/lock`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update lock status."
    );
  }

  return data;
}

export async function updateAdminDiscussionStatus(
  token,
  discussionId,
  status
) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update discussion status."
    );
  }

  return data;
}

export async function deleteAdminDiscussion(
  token,
  discussionId
) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete discussion."
    );
  }

  return data;
}

export async function deleteAdminReply(
  token,
  discussionId,
  replyId
) {
  const response = await fetch(
    `${API_URL}/admin/discussions/${discussionId}/replies/${replyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete reply."
    );
  }

  return data;
}

export async function getAdminUsers(token) {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load users.");
  }

  return data;
}

export async function getAdminUser(token, userId) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load user.");
  }

  return data;
}

export async function toggleAdminUserStatus(token, userId) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}/status`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update user status."
    );
  }

  return data;
}

export async function updateAdminUserRole(
  token,
  userId,
  role
) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}/role`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update user role."
    );
  }

  return data;
}

export async function deleteAdminUser(token, userId) {
  const response = await fetch(
    `${API_URL}/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete user."
    );
  }

  return data;
}

export async function getAdminReports(token) {
  const response = await fetch(`${API_URL}/admin/reports`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load reports.");
  }

  return data;
}

export async function getAdminReport(token, reportId) {
  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load report.");
  }

  return data;
}

export async function updateAdminReportStatus(
  token,
  reportId,
  status
) {
  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update report status."
    );
  }

  return data;
}

export async function deleteReportedContent(
  token,
  reportId
) {
  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/content`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to remove reported content."
    );
  }

  return data;
}
// =========================================================
// HISTORY
// =========================================================

export async function getAdminHistories(token) {
  const response = await fetch(
    `${API_URL}/content/history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load history studies."
    );
  }

  return data;
}

export async function getAdminHistory(
  token,
  historyId
) {
  const response = await fetch(
    `${API_URL}/content/history/${historyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load history study."
    );
  }

  return data;
}

export async function createAdminHistory(
  token,
  historyData
) {
  const response = await fetch(
    `${API_URL}/content/history`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(historyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create history study."
    );
  }

  return data;
}

export async function updateAdminHistory(
  token,
  historyId,
  historyData
) {
  const response = await fetch(
    `${API_URL}/content/history/${historyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(historyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update history study."
    );
  }

  return data;
}

export async function deleteAdminHistory(
  token,
  historyId
) {
  const response = await fetch(
    `${API_URL}/content/history/${historyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete history study."
    );
  }

  return data;
}

// =========================================================
// CHRISTIAN LIVING
// =========================================================

export async function getAdminChristianLiving(token) {
  const response = await fetch(
    `${API_URL}/content/christian-living`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load Christian Living studies."
    );
  }

  return data;
}


export async function getAdminChristianLivingStudy(
  token,
  studyId
) {
  const response = await fetch(
    `${API_URL}/content/christian-living/${studyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load Christian Living study."
    );
  }

  return data;
}


export async function createAdminChristianLiving(
  token,
  studyData
) {
  const response = await fetch(
    `${API_URL}/content/christian-living`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create Christian Living study."
    );
  }

  return data;
}


export async function updateAdminChristianLiving(
  token,
  studyId,
  studyData
) {
  const response = await fetch(
    `${API_URL}/content/christian-living/${studyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update Christian Living study."
    );
  }

  return data;
}


export async function deleteAdminChristianLiving(
  token,
  studyId
) {
  const response = await fetch(
    `${API_URL}/content/christian-living/${studyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete Christian Living study."
    );
  }

  return data;
}



export async function getAdminHealth(token) {
  const response = await fetch(`${API_URL}/content/health`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load Health content."
    );
  }

  return data;
}

export async function getAdminHealthStudy(token, studyId) {
  const response = await fetch(
    `${API_URL}/content/health/${studyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load Health content."
    );
  }

  return data;
}

export async function createAdminHealth(token, studyData) {
  const response = await fetch(`${API_URL}/content/health`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(studyData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create Health content."
    );
  }

  return data;
}

export async function updateAdminHealth(
  token,
  studyId,
  studyData
) {
  const response = await fetch(
    `${API_URL}/content/health/${studyId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studyData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update Health content."
    );
  }

  return data;
}

export async function deleteAdminHealth(token, studyId) {
  const response = await fetch(
    `${API_URL}/content/health/${studyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete Health content."
    );
  }

  return data;
}
