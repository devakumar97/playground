import { faker } from '@faker-js/faker'
import { db } from '#app/utils/db.server.ts'
import { eq } from 'drizzle-orm'
import {
  users,
  passwords,
  roles,
  userImages,
  notes,
  noteImages,
  connections,
} from '../drizzle/schema'

import {
  createPassword,
  createUser,
  getNoteImages,
  getUserImages,
} from '#tests/db-utils.ts'
import { insertGitHubUser } from '#tests/mocks/github.ts'
import { MOCK_CODE_GITHUB } from '#app/utils/providers/constants'

async function seed() {
  console.log('🌱 Seeding...')
  console.time('🌱 Database has been seeded')

  const totalUsers = 5
  const userImgs = await getUserImages()
  const noteImgs = await getNoteImages()

  console.time(`👤 Created ${totalUsers} users...`)

  for (let i = 0; i < totalUsers; i++) {
    const userData = createUser()
    const [user] = await db
      .insert(users)
      .values({ ...userData })
      .returning({ id: users.id })
      if (!user) throw new Error('Failed to create user')

    await db.insert(passwords).values({
      userId: user.id,
      hash: createPassword(userData.username).hash,
    })
    await db.insert(roles).values([
      { name: 'user' },
      { name: 'admin' },
    ])
  const [userRole] = await db.select().from(roles).where(eq(roles.name, 'user'));
  const [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin'));
if (!userRole ) throw new Error('Failed to create user')
   await db.insert(userRoles).values({
  userId: user.id,
  roleId: userRole.id,
})


    const userImage = userImgs[i % userImgs.length]
    if (userImage) {
      await db.insert(userImages).values({
        userId: user.id,
        objectKey: userImage.objectKey,
      })
    }

    const notesCount = faker.number.int({ min: 1, max: 3 })

    for (let j = 0; j < notesCount; j++) {
      const [note] = await db
        .insert(notes)
        .values({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          ownerId: user.id,
        })
        .returning({ id: notes.id })

      const imgCount = faker.number.int({ min: 1, max: 3 })
      for (let k = 0; k < imgCount; k++) {
        const img = noteImgs[faker.number.int({ min: 0, max: 9 })]
        if (img) {
          await db.insert(noteImages).values({
            noteId: note.id,
            altText: img.altText,
            objectKey: img.objectKey,
          })
        }
      }
    }
  }

  console.timeEnd(`👤 Created ${totalUsers} users...`)

  console.time(`🐨 Created admin user "kody"`)

  const githubUser = await insertGitHubUser(MOCK_CODE_GITHUB)

  const [kody] = await db
    .insert(users)
    .values({
      email: 'kody@kcd.dev',
      username: 'kody',
      name: 'Kody',
    })
    .returning({ id: users.id })
    if (!kody) throw new Error('Failed to create user kody')
  await db.insert(passwords).values({
    userId: kody.id,
    hash: createPassword('kodylovesyou').hash,
  })

  await db.insert(connections).values({
    userId: kody.id,
    providerId: String(githubUser.profile.id),
    providerName: 'github',
  })

  await db.insert(userRoles).values([
  { userId: kody.id, roleId: adminRole.id },
  { userId: kody.id, roleId: userRole.id },
])


  const kodyImages = {
    kodyUser: { objectKey: 'user/kody.png' },
    cuteKoala: {
      altText: 'an adorable koala cartoon illustration',
      objectKey: 'kody-notes/cute-koala.png',
    },
    koalaEating: {
      altText: 'a cartoon illustration of a koala in a tree eating',
      objectKey: 'kody-notes/koala-eating.png',
    },
    koalaCuddle: {
      altText: 'a cartoon illustration of koalas cuddling',
      objectKey: 'kody-notes/koala-cuddle.png',
    },
    mountain: {
      altText: 'a beautiful mountain covered in snow',
      objectKey: 'kody-notes/mountain.png',
    },
    koalaCoder: {
      altText: 'a koala coding at the computer',
      objectKey: 'kody-notes/koala-coder.png',
    },
    koalaMentor: {
      altText:
        'a koala in a friendly and helpful posture. The Koala is standing next to and teaching a woman who is coding on a computer and shows positive signs of learning and understanding what is being explained.',
      objectKey: 'kody-notes/koala-mentor.png',
    },
    koalaSoccer: {
      altText: 'a cute cartoon koala kicking a soccer ball on a soccer field ',
      objectKey: 'kody-notes/koala-soccer.png',
    },
  }

  await db.insert(userImages).values({
    userId: kody.id,
    objectKey: kodyImages.kodyUser.objectKey,
  })

  const kodyNotes = [
    {
      id: 'd27a197e',
      title: 'Basic Koala Facts',
      content:
        'Koalas are found in the eucalyptus forests of eastern Australia...',
      images: [kodyImages.cuteKoala, kodyImages.koalaEating],
    },
    {
      id: '414f0c09',
      title: 'Koalas like to cuddle',
      content:
        'Cuddly critters, koalas measure about 60cm to 85cm long...',
      images: [kodyImages.koalaCuddle],
    },
    {
      id: '260366b1',
      title: 'Not bears',
      content: "Although you may have heard people call them koala 'bears'...",
      images: [],
    },
    {
      id: 'bb79cf45',
      title: 'Snowboarding Adventure',
      content: 'Today was an epic day on the slopes...',
      images: [kodyImages.mountain],
    },
    {
      id: '9f4308be',
      title: 'Onewheel Tricks',
      content: "Mastered a new trick on my Onewheel today...",
      images: [],
    },
    {
      id: '306021fb',
      title: 'Coding Dilemma',
      content: "Stuck on a bug in my latest coding project...",
      images: [kodyImages.koalaCoder],
    },
    {
      id: '16d4912a',
      title: 'Coding Mentorship',
      content: "Had a fantastic coding mentoring session...",
      images: [kodyImages.koalaMentor],
    },
    {
      id: '3199199e',
      title: 'Koala Fun Facts',
      content: 'Did you know that koalas sleep for up to 20 hours a day?',
      images: [],
    },
    {
      id: '2030ffd3',
      title: 'Skiing Adventure',
      content: 'Spent the day hitting the slopes on my skis...',
      images: [kodyImages.mountain],
    },
    {
      id: 'f375a804',
      title: 'Code Jam Success',
      content: 'Participated in a coding competition today...',
      images: [kodyImages.koalaCoder],
    },
    {
      id: '562c541b',
      title: 'Koala Conservation Efforts',
      content: 'Joined a local conservation group...',
      images: [],
    },
    {
      id: 'f67ca40b',
      title: 'Game day',
      content: 'Just got back from the most amazing game...',
      images: [kodyImages.koalaSoccer],
    },
  ]

  for (const note of kodyNotes) {
    const [createdNote] = await db
      .insert(notes)
      .values({
        id: note.id,
        title: note.title,
        content: note.content,
        ownerId: kody.id,
      })
      .returning({ id: notes.id })
if (!createdNote) throw new Error('Failed to create notes')
    for (const image of note.images) {
      await db.insert(noteImages).values({
        noteId: createdNote.id,
        altText: image.altText,
        objectKey: image.objectKey,
      })
    }
  }

  console.timeEnd(`🐨 Created admin user "kody"`)
  console.timeEnd('🌱 Database has been seeded')
}

seed().catch(console.error)
