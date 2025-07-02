import prisma from "../data/prisma";

const initialCache = async() => {
  try {
    const caches = ["cache_tasks"];
    // find exist
    const findCacheExist = await prisma.cacheStorages.findMany({
      where: { cache_name: { in: caches } },
      select: { cache_name: true }
    });
    // filter
    const filterCaches = caches.filter(cache => !findCacheExist.map(cacheExist => cacheExist.cache_name).includes(cache));
    // create
    for (let cache of filterCaches) await prisma.cacheStorages.create({ data: { cache_name: cache } });
    // response
    console.log("Caches were created successfully.");
  } catch (error) {
    console.error({ position: "Initial cache", error });
    return;
  }
}

initialCache();